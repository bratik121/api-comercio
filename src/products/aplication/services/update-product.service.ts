import { IService } from 'src/common/aplication/services/IServices';
import { IOdmProductRepository } from 'src/products/domain/repositories/odm-product.repository.interface';

import { Result } from 'src/common/abstractions/result';
import {
  ProductIdVo,
  ProductNameVo,
  ProductDescriptionVo,
  ProductPriceVo,
  ProductStockVo,
} from 'src/products/domain/value-objects';
import { NotFoundProductException } from 'src/products/infraestructure/exceptions';
import { Product } from 'src/products/domain/product';
import { UpdateProductRequest, UpdateProductResponse } from '../dtos';
import { IEventPublisher } from 'src/common/aplication/events/event-publisher.interfaces';

export class UpdateProductService extends IService<
  UpdateProductRequest,
  UpdateProductResponse
> {
  private readonly _odmProductRepository: IOdmProductRepository;
  private readonly eventPublisher: IEventPublisher;
  constructor(
    odmProductRepository: IOdmProductRepository,
    eventPublisher: IEventPublisher,
  ) {
    super();
    this._odmProductRepository = odmProductRepository;
    this.eventPublisher = eventPublisher;
  }

  async execute(
    command: UpdateProductRequest,
  ): Promise<Result<UpdateProductResponse>> {
    const productId = ProductIdVo.create(command.id);

    const productResult =
      await this._odmProductRepository.findProductById(productId);

    if (productResult.isFailure()) {
      return Result.fail<UpdateProductResponse>(
        new NotFoundProductException(`Product with ID ${command.id} not found`),
      );
    }

    const oldProduct = productResult.getValue();

    const updatedProduct = Product.create(
      oldProduct.getId(),
      command.name ? ProductNameVo.create(command.name) : oldProduct.getName(),
      command.description
        ? ProductDescriptionVo.create(command.description)
        : oldProduct.getDescription(),
      command.price
        ? ProductPriceVo.create(command.price)
        : oldProduct.getPrice(),
      command.stock
        ? ProductStockVo.create(command.stock)
        : oldProduct.getStock(),
    );

    updatedProduct.Update(
      command.name ? ProductNameVo.create(command.name) : undefined,
      command.description
        ? ProductDescriptionVo.create(command.description)
        : undefined,
      command.price ? ProductPriceVo.create(command.price) : undefined,
      command.stock ? ProductStockVo.create(command.stock) : undefined,
    );

    const saveResult =
      await this._odmProductRepository.updateProduct(updatedProduct);

    if (saveResult.isFailure()) {
      return Result.fail<UpdateProductResponse>(saveResult.getError());
    }

    const savedProduct = saveResult.getValue();
    this.eventPublisher.publish(updatedProduct.pullDomainEvents());

    return Result.success<UpdateProductResponse>(
      new UpdateProductResponse(
        savedProduct.getId().getId(),
        savedProduct.getName().getName(),
        savedProduct.getDescription().getDescription(),
        savedProduct.getPrice().getPrice(),
        savedProduct.getStock().getStock(),
      ),
    );
  }
}
