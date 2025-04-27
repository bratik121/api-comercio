import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Inject,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/infraestructure/guards/jwt-guard.guard';
import { IIdGen } from 'src/common/aplication/id-gen/id-gen.interfaces';
import { UuidGen } from 'src/common/infraestructure/id-gen/uuid-gen';
import { IAsyncMapper } from 'src/common/aplication/mappers/async-mapper.interface';
import { Order } from 'src/order/domain/order';
import { OdmOrderEntity } from '../entities/order/odm-order.entity';
import { OrmOrderEntity } from '../entities/order/orm-order.entity';
import { OdmOrderMapper } from '../mappers/order/odm-order.mapper';
import { OrmOrderMapper } from '../mappers/order/orm-order.mapper';
import { IOdmOrderRepository } from 'src/order/domain/repositories/order/odm-order.repository.interface';
import { IOrmOrderRepository } from 'src/order/domain/repositories/order/orm-order.repository.interface';
import { IService } from 'src/common/aplication/services/IServices';
import { CreateOrderRequest } from 'src/order/aplication/dtos/requests/create-order.request';
import { CreateOrderResponse } from 'src/order/aplication/dtos/responses/create-order.response';
import { FindOrderByIdRequest } from 'src/order/aplication/dtos/requests/find-order-by-id.request';
import { FindOrderByIdResponse } from 'src/order/aplication/dtos/responses/find-order-by-id.response';
import { FindOrdersByIdUserRequest } from 'src/order/aplication/dtos/requests/find-orders-by-id-user.request';
import { FindOrdersByIdUserResponse } from 'src/order/aplication/dtos/responses/find-orders-by-id-user.response';
import { FindOrdersRequest } from 'src/order/aplication/dtos/requests/find-orders.request';
import { FindOrdersResponse } from 'src/order/aplication/dtos/responses/find-orders.response';
import { IEventPublisher } from 'src/common/aplication/events/event-publisher.interfaces';
import { IEventSubscriber } from 'src/common/aplication/events/event-suscriber.interface';
import { OrderRegisteredEvent } from 'src/order/domain/events/order-registered.event';
import { OdmSaveOrderEvent } from '../events/odm-save-order.event';
import { UpdateProductStockEvent } from '../events/update-product-sctock.event';
import { InjectEntityManager } from '@nestjs/typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityManager } from 'typeorm';
import { Channel } from 'amqplib';
import { OdmOrderRepository } from '../repositories/order/odm-order.repositoy';
import { OrmOrderRepository } from '../repositories/order/orm-order.repository';
import { RabbitMQEventPublisher } from 'src/common/infraestructure/events/publishers/rabbittMq.publisher';
import { ExceptionDecorator } from 'src/common/aplication/aspects/exceptionDecorator';
import { CreateOrderService } from 'src/order/aplication/services/create-order.service';
import {
  FindOrderByIdService,
  FindOrdersByUserIdService,
  FindOrdersService,
} from 'src/order/aplication/services';
import { RegisteredOrderEventMapper } from '../mappers/domain-event-mappers/registered-order.event.mapper';
import { IMapper } from 'src/common/aplication/mappers/mapper.interface';
import { OrderItem } from 'src/order/domain/entities/order-item';
import { OdmOrderItemEntity } from '../entities/order-item/odm-order-item.entity';
import { OdmOrderItemMapper, OrmOrderItemMapper } from '../mappers/order-item';
import { OrmOrderItemEntity } from '../entities/order-item';
import {
  IOdmOrderItemRepository,
  IOrmOrderItemRepository,
} from 'src/order/domain/repositories';
import {
  OdmOrderItemRepository,
  OrmOrderItemRepository,
} from '../repositories/order-item';
import { Product } from 'src/products/domain/product';
import {
  OdmProductEntity,
  OrmProductEntity,
} from 'src/products/infraestructure/entities';
import { OdmProductMapper } from 'src/products/infraestructure/mappers/odm-mappers';
import { OrmProductMapper } from 'src/products/infraestructure/mappers/orm-mappers';
import {
  IOdmProductRepository,
  IOrmProductRepository,
} from 'src/products/domain/repositories';
import { OdmProductRepository } from 'src/products/infraestructure/repositories/odm-repositories/odm-product-repositoty';
import { OrmProductRepository } from 'src/products/infraestructure/repositories/orm-repositories/orm-product.repository';
import { CreateOrderDto } from '../dtos';

@ApiTags('Order')
@Controller('order')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class OrderController {
  private readonly genId: IIdGen = new UuidGen();

  //?Mappers
  private readonly _odmOrderItemMapper: IMapper<OrderItem, OdmOrderItemEntity> =
    new OdmOrderItemMapper();
  private readonly _ormOrderItemMapper: IMapper<OrderItem, OrmOrderItemEntity> =
    new OrmOrderItemMapper();
  private readonly _odmProductMapper: IMapper<Product, OdmProductEntity> =
    new OdmProductMapper();
  private readonly _ormProductMapper: IMapper<Product, OrmProductEntity> =
    new OrmProductMapper();

  //? Async Mappers
  private readonly _odmOrderMapper: IAsyncMapper<Order, OdmOrderEntity>;
  private readonly _ormOrderMapper: IAsyncMapper<Order, OrmOrderEntity>;

  //? Repositories
  private readonly _odmOrderItemRepository: IOdmOrderItemRepository;
  private readonly _ormOrderItemRepository: IOrmOrderItemRepository;
  private readonly _odmOrderRepository: IOdmOrderRepository;
  private readonly _ormOrderRepository: IOrmOrderRepository;
  private readonly _odmProductRepository: IOdmProductRepository;
  private readonly _ormProductRepository: IOrmProductRepository;

  //? Services
  private createOrderService: IService<CreateOrderRequest, CreateOrderResponse>;
  private findOrderByIdService: IService<
    FindOrderByIdRequest,
    FindOrderByIdResponse
  >;
  private findOrdersByUserIdService: IService<
    FindOrdersByIdUserRequest,
    FindOrdersByIdUserResponse
  >;
  private findOrdersService: IService<FindOrdersRequest, FindOrdersResponse>;

  //? Event Publisher
  private readonly _eventPublisher: IEventPublisher;

  //? Events
  private readonly _odmSaveOrderEvent: IEventSubscriber<OrderRegisteredEvent>;
  private readonly _updateProductStockEvent: IEventSubscriber<OrderRegisteredEvent>;

  constructor(
    @Inject('RABBITMQ_CONNECTION') private readonly channel: Channel,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectModel('order_item') orderItemModel: Model<OdmOrderItemEntity>,
    @InjectModel('order') orderModel: Model<OdmOrderEntity>,
    @InjectModel('product') productModel: Model<OdmProductEntity>,
  ) {
    //* Repositories
    this._odmOrderItemRepository = new OdmOrderItemRepository(
      orderItemModel,
      this._odmOrderItemMapper,
    );
    this._ormOrderItemRepository = new OrmOrderItemRepository(
      entityManager,
      this._ormOrderItemMapper,
    );
    this._odmProductRepository = new OdmProductRepository(
      productModel,
      this._odmProductMapper,
    );

    this._ormProductRepository = new OrmProductRepository(
      entityManager,
      this._ormProductMapper,
    );

    //* Async Mappers
    this._odmOrderMapper = new OdmOrderMapper(this._odmOrderItemRepository);
    this._ormOrderMapper = new OrmOrderMapper(this._ormOrderItemRepository);

    //* Repositories
    this._odmOrderRepository = new OdmOrderRepository(
      orderModel,
      this._odmOrderMapper,
    );
    this._ormOrderRepository = new OrmOrderRepository(
      entityManager,
      this._ormOrderMapper,
    );

    //* Publisher
    this._eventPublisher = new RabbitMQEventPublisher(channel);

    //* Events
    this._odmSaveOrderEvent = new OdmSaveOrderEvent(
      this._odmOrderRepository,
      this._odmOrderItemRepository,
    );
    this._updateProductStockEvent = new UpdateProductStockEvent(
      this._odmProductRepository,
      this._ormProductRepository,
      this._eventPublisher,
    );

    //* Services
    this.createOrderService = new ExceptionDecorator(
      new CreateOrderService(
        this._odmProductRepository,
        this._ormOrderRepository,
        this._ormOrderItemRepository,
        this._eventPublisher,
        this.genId,
      ),
    );
    this.findOrdersService = new ExceptionDecorator(
      new FindOrdersService(this._odmOrderRepository),
    );

    this.findOrderByIdService = new ExceptionDecorator(
      new FindOrderByIdService(this._odmOrderRepository),
    );

    this.findOrdersByUserIdService = new ExceptionDecorator(
      new FindOrdersByUserIdService(this._odmOrderRepository),
    );

    //* Subscribe to events
    this._eventPublisher.subscribe(
      OrderRegisteredEvent.name,
      [this._odmSaveOrderEvent, this._updateProductStockEvent],
      RegisteredOrderEventMapper,
    );
  }

  @Post('create')
  @ApiCreatedResponse({ description: 'Order created successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async createOrder(@Body() body: CreateOrderDto) {
    const request = new CreateOrderRequest(
      body.userId,
      body.status,
      body.items,
    );

    const response = await this.createOrderService.execute(request);
    if (response.isSuccess()) {
      return response.getValue().dataToString();
    }
    return response;
  }

  @Get(':id')
  @ApiFoundResponse({ description: 'Order found successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async findOrderById(@Param('id') id: string) {
    const request = new FindOrderByIdRequest(id);

    const response = await this.findOrderByIdService.execute(request);
    if (response.isSuccess()) {
      return response.getValue();
    }
    return response;
  }

  @Get('user/:userId')
  @ApiFoundResponse({ description: 'Orders found successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async findOrdersByUserId(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const pagination =
      limit && offset
        ? { limit: parseInt(limit), offset: parseInt(offset) }
        : undefined;
    const request = new FindOrdersByIdUserRequest(userId, pagination);

    const response = await this.findOrdersByUserIdService.execute(request);
    if (response.isSuccess()) {
      return response.getValue();
    }
    return response;
  }

  @Get()
  @ApiFoundResponse({ description: 'Orders found successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async findOrders(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const pagination =
      limit && offset
        ? { limit: parseInt(limit), offset: parseInt(offset) }
        : undefined;
    const request = new FindOrdersRequest(pagination);

    const response = await this.findOrdersService.execute(request);
    if (response.isSuccess()) {
      return response.getValue();
    }
    return response;
  }
}
