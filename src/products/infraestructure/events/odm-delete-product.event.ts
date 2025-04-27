import { IEventSubscriber } from 'src/common/aplication/events/event-suscriber.interface';
import { ProductDeletedEvent } from 'src/products/domain/events/product-deleted.event';
import { IOdmProductRepository } from 'src/products/domain/repositories/odm-product.repository.interface';

export class OdmDeleteProductEvent
  implements IEventSubscriber<ProductDeletedEvent>
{
  constructor(private readonly _odmProductRepository: IOdmProductRepository) {}

  async on(event: ProductDeletedEvent): Promise<void> {
    const result = await this._odmProductRepository.deleteProduct(event.id);

    if (result.isFailure()) {
      throw result.getError();
    }
  }
}
