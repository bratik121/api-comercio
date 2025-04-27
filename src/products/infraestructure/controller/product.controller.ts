import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
  Query,
  Put,
  Patch,
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
  FindProductsRequest,
  FindProductsResponse,
  UpdateProductRequest,
  UpdateProductResponse,
} from 'src/products/aplication/dtos';
import { IEventPublisher } from 'src/common/aplication/events/event-publisher.interfaces';
import { IEventSubscriber } from 'src/common/aplication/events/event-suscriber.interface';
import {
  ProductRegisteredEvent,
  ProductUpdatedEvent,
} from 'src/products/domain/events';
import { EntityManager } from 'typeorm';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OdmProductRepository } from '../repositories/odm-repositories/odm-product-repositoty';
import { OrmProductRepository } from '../repositories/orm-repositories/orm-product.repository';
import { OdmSaveProductEvent, OdmUpdateProductEvent } from '../events';
import {
  CreateProductService,
  FindProductByIdService,
  FindProductsService,
  UpdateProductService,
} from 'src/products/aplication/services';
import {
  RegisteredProductMapper,
  UpdatedProductEventMapper,
} from '../mappers/domain-event-mappers';
import { RabbitMQEventPublisher } from 'src/common/infraestructure/events/publishers/rabbittMq.publisher';
import { CreateProductDto, UpdateProductDto } from '../dtos';
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
  private findProductsService: IService<
    FindProductsRequest,
    FindProductsResponse
  >;
  private updateProductService: IService<
    UpdateProductRequest,
    UpdateProductResponse
  >;

  //? Events
  private readonly _saveProductEvent: IEventSubscriber<ProductRegisteredEvent>;
  private readonly _updateProductEvent: IEventSubscriber<ProductUpdatedEvent>;

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

    this.findProductsService = new ExceptionDecorator(
      new FindProductsService(this._odmProductRepository),
    );

    this.updateProductService = new ExceptionDecorator(
      new UpdateProductService(
        this._ormProductRepository,
        this._odmProductRepository,
        this._eventPublisher,
      ),
    );

    //* Events
    this._saveProductEvent = new OdmSaveProductEvent(
      this._odmProductRepository,
    );

    this._updateProductEvent = new OdmUpdateProductEvent(
      this._odmProductRepository,
    );

    //* Subscribe to events
    this._eventPublisher.subscribe(
      ProductRegisteredEvent.name,
      [this._saveProductEvent],
      RegisteredProductMapper,
    );

    this._eventPublisher.subscribe(
      ProductUpdatedEvent.name,
      [this._updateProductEvent],
      UpdatedProductEventMapper,
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
      return response.getValue();
    }
    return response;
  }

  @Get()
  @ApiOkResponse({ description: 'Products found successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async findProducts(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const pagination =
      limit && offset
        ? { limit: parseInt(limit), offset: parseInt(offset) }
        : undefined;
    const request = new FindProductsRequest(pagination);

    const response = await this.findProductsService.execute(request);
    if (response.isSuccess()) {
      return response.getValue();
    }
    return response;
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Product updated successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
    const request = new UpdateProductRequest(
      id,
      body.name,
      body.description,
      body.price,
      body.stock,
    );

    const response = await this.updateProductService.execute(request);
    if (response.isSuccess()) {
      return response.getValue().dataToString();
    }
    return response;
  }
}
