import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IIdGen } from 'src/common/aplication/id-gen/id-gen.interfaces';
import { IMapper } from 'src/common/aplication/mappers/mapper.interface';
import { UuidGen } from 'src/common/infraestructure/id-gen/uuid-gen';
import { Product } from 'src/products/domain/product';
import { OdmProductEntity } from '../entities/odm-entities';
import { OdmProductMapper } from '../mappers/odm-mappers/odm-product.mapper';
import { OrmProductMapper } from '../mappers/orm-mappers/orm-product.mapper';
import { OrmProductEntity } from '../entities/orm-entities';
import { InjectEntityManager } from '@nestjs/typeorm';
import {
  IOdmProductRepository,
  IOrmProductRepository,
} from 'src/products/domain/repositories';
import { IService } from 'src/common/aplication/services/IServices';
import {
  CreateProductRequest,
  CreateProductResponse,
  FindProductByIdRequest,
  FindProductByIdResponse,
} from 'src/products/aplication/dtos';
import { IEventPublisher } from 'src/common/aplication/events/event-publisher.interfaces';
import { IEventSubscriber } from 'src/common/aplication/events/event-suscriber.interface';
import { ProductRegistered } from 'src/products/domain/events';
import { EntityManager } from 'typeorm';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OdmProductRepository } from '../repositories/odm-repositories/odm-product-repositoty';
import { OrmProductRepository } from '../repositories/orm-repositories/orm-product.repository';
import { OdmSaveProductEvent } from '../events';
import {
  CreateProductService,
  FindProductByIdService,
} from 'src/products/aplication/services';
import { RegisteredProductMapper } from '../mappers/domain-event-mappers';
import { RabbitMQEventPublisher } from 'src/common/infraestructure/events/publishers/rabbittMq.publisher';
import { CreateProductDto } from '../dtos';
import { Channel } from 'amqplib';
import { ExceptionDecorator } from 'src/common/aplication/aspects/exceptionDecorator';
import { JwtAuthGuard } from 'src/auth/infraestructure/guards/jwt-guard.guard';

@ApiTags('Product')
@Controller('product')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductController {
  //? Id generator
  private readonly genId: IIdGen = new UuidGen();

  //? Publisher
  private readonly _eventPublisher: IEventPublisher;

  //? Mappers
  private readonly _odmProductMapper: IMapper<Product, OdmProductEntity> =
    new OdmProductMapper();
  private readonly _ormProductMapper: IMapper<Product, OrmProductEntity> =
    new OrmProductMapper();

  //? Repositories
  private readonly _odmProductRepository: IOdmProductRepository;
  private readonly _ormProductRepository: IOrmProductRepository;

  //? Services
  private createProductService: IService<
    CreateProductRequest,
    CreateProductResponse
  >;
  private findProductByIdService: IService<
    FindProductByIdRequest,
    FindProductByIdResponse
  >;

  //? Events
  private readonly _saveProductEvent: IEventSubscriber<ProductRegistered>;

  constructor(
    @Inject('RABBITMQ_CONNECTION') private readonly channel: Channel,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectModel('product') productModel: Model<OdmProductEntity>,
  ) {
    //* Publisher
    this._eventPublisher = new RabbitMQEventPublisher(channel);

    //* Repositories
    this._odmProductRepository = new OdmProductRepository(
      productModel,
      this._odmProductMapper,
    );
    this._ormProductRepository = new OrmProductRepository(
      this.entityManager,
      this._ormProductMapper,
    );

    //* Services
    this.createProductService = new ExceptionDecorator(
      new CreateProductService(
        this._odmProductRepository,
        this._ormProductRepository,
        this._eventPublisher,
        this.genId,
      ),
    );

    this.findProductByIdService = new ExceptionDecorator(
      new FindProductByIdService(this._odmProductRepository),
    );

    //* Events
    this._saveProductEvent = new OdmSaveProductEvent(
      this._odmProductRepository,
    );

    //* Subscribe to events
    this._eventPublisher.subscribe(
      ProductRegistered.name,
      [this._saveProductEvent],
      RegisteredProductMapper,
    );
  }

  @Post('create')
  @ApiCreatedResponse({ description: 'Product created successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async createProduct(@Body() body: CreateProductDto) {
    const request = new CreateProductRequest(
      body.name,
      body.description,
      body.price,
      body.stock,
    );

    const response = await this.createProductService.execute(request);
    if (response.isSuccess()) {
      return response.getValue().dataToString();
    }
    return response;
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Product found successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async findProductById(@Param('id') id: string) {
    const request = new FindProductByIdRequest(id);

    const response = await this.findProductByIdService.execute(request);
    if (response.isSuccess()) {
      return response.getValue().dataToString();
    }
    return response;
  }
}
