import { IService } from 'src/common/aplication/services/IServices';
import { IOdmProductRepository } from 'src/products/domain/repositories/odm-product.repository.interface';
import { IOrmProductRepository } from 'src/products/domain/repositories/orm-product.repository.interface';
import { IEventPublisher } from 'src/common/aplication/events/event-publisher.interfaces';
import { DeleteProductRequest } from '../dtos/requests/delete-product.request';
import { DeleteProductResponse } from '../dtos/responses/delete-product.response';
import { Result } from 'src/common/abstractions/result';
import { ProductIdVo } from 'src/products/domain/value-objects';

export class DeleteProductService extends IService<
  DeleteProductRequest,
  DeleteProductResponse
> {
  private readonly _ormProductRepository: IOrmProductRepository;
  private readonly _odmProductRepository: IOdmProductRepository;
  private readonly eventPublisher: IEventPublisher;

  constructor(
    ormProductRepository: IOrmProductRepository,
    odmProductRepository: IOdmProductRepository,
    eventPublisher: IEventPublisher,
  ) {
    super();
    this._odmProductRepository = odmProductRepository;
    this._ormProductRepository = ormProductRepository;
    this.eventPublisher = eventPublisher;
  }

  async execute(
    command: DeleteProductRequest,
  ): Promise<Result<DeleteProductResponse>> {
    const productId = ProductIdVo.create(command.id);

    // Verificar si el producto existe
    const productResult =
      await this._odmProductRepository.findProductById(productId);

    if (productResult.isFailure()) {
      throw productResult.getError();
    }

    const deleteResult =
      await this._ormProductRepository.deleteProduct(productId);

    if (deleteResult.isFailure()) {
      throw deleteResult.getError();
    }

    const product = productResult.getValue();
    product.Delete();

    // Publicar los eventos de dominio
    this.eventPublisher.publish(product.pullDomainEvents());

    return Result.success<DeleteProductResponse>(
      new DeleteProductResponse(
        product.getId().getId(),
        product.getName().getName(),
        product.getDescription().getDescription(),
        product.getPrice().getPrice(),
        product.getStock().getStock(),
      ),
    );
  }
}
