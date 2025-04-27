import { IEventSubscriber } from 'src/common/aplication/events/event-suscriber.interface';
import { ProductRegistered } from 'src/products/domain/events/product-registered.event';
import { IOdmProductRepository } from 'src/products/domain/repositories/odm-product.repository.interface';
import { Product } from 'src/products/domain/product';

export class OdmSaveProductEvent
  implements IEventSubscriber<ProductRegistered>
{
  constructor(private readonly _odmProductRepository: IOdmProductRepository) {}

  async on(event: ProductRegistered): Promise<void> {
    const product = Product.create(
      event.id,
      event.name,
      event.description,
      event.price,
      event.stock,
    );
    await this._odmProductRepository.saveProduct(product);
  }
}
