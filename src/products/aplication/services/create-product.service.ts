import {
  ProductIdVo,
  ProductNameVo,
  ProductDescriptionVo,
  ProductPriceVo,
  ProductStockVo,
} from 'src/products/domain/value-objects';
import { DuplicateProductException } from 'src/products/domain/exceptions';
import { Product } from 'src/products/domain/product';
import { IService } from 'src/common/aplication/services/IServices';
import { CreateProductRequest, CreateProductResponse } from '../dtos';
import {
  IOdmProductRepository,
  IOrmProductRepository,
} from 'src/products/domain/repositories';
import { IIdGen } from 'src/common/aplication/id-gen/id-gen.interfaces';
import { IEventPublisher } from 'src/common/aplication/events/event-publisher.interfaces';
import { Result } from 'src/common/abstractions/result';

export class CreateProductService extends IService<
  CreateProductRequest,
  CreateProductResponse
> {
  private readonly _odmProductRepository: IOdmProductRepository;
  private readonly _ormProductRepository: IOrmProductRepository;
  private readonly eventPublisher: IEventPublisher;
  private readonly genId: IIdGen;

  constructor(
    odmProductRepository: IOdmProductRepository,
    ormProductRepository: IOrmProductRepository,
    eventPublisher: IEventPublisher,
    genId: IIdGen,
  ) {
    super();
    this._odmProductRepository = odmProductRepository;
    this._ormProductRepository = ormProductRepository;
    this.eventPublisher = eventPublisher;
    this.genId = genId;
  }

  async execute(
    command: CreateProductRequest,
  ): Promise<Result<CreateProductResponse>> {
    const duplicateProduct = await this._odmProductRepository.findProductByName(
      ProductNameVo.create(command.name),
    );

    // Verificamos si el producto ya existe
    if (duplicateProduct.isSuccess()) {
      throw new DuplicateProductException(
        `El Producto ${command.name} ya existe`,
      );
    }

    const domainProduct = Product.create(
      ProductIdVo.create(await this.genId.genId()),
      ProductNameVo.create(command.name),
      ProductDescriptionVo.create(command.description),
      ProductPriceVo.create(command.price),
      ProductStockVo.create(command.stock),
    );

    const savedProductResult =
      await this._ormProductRepository.saveProduct(domainProduct);

    if (savedProductResult.isSuccess()) {
      const savedProduct = savedProductResult.getValue();
      savedProduct.Register();
      this.eventPublisher.publish(savedProduct.pullDomainEvents());
      return Result.success<CreateProductResponse>(
        new CreateProductResponse(
          savedProduct.getId().getId(),
          savedProduct.getName().getName(),
          savedProduct.getDescription().getDescription(),
          savedProduct.getPrice().getPrice(),
          savedProduct.getStock().getStock(),
        ),
      );
    }

    return Result.fail<CreateProductResponse>(savedProductResult.getError());
  }
}
