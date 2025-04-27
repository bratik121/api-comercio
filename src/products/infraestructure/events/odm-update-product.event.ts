import { IEventSubscriber } from 'src/common/aplication/events/event-suscriber.interface';
import { ProductUpdatedEvent } from 'src/products/domain/events/product-updated.event';
import { IOdmProductRepository } from 'src/products/domain/repositories/odm-product.repository.interface';
import { Product } from 'src/products/domain/product';

export class OdmUpdateProductEvent
  implements IEventSubscriber<ProductUpdatedEvent>
{
  constructor(private readonly _odmProductRepository: IOdmProductRepository) {}

  async on(event: ProductUpdatedEvent): Promise<void> {
    const oldProductResult = await this._odmProductRepository.findProductById(
      event.id,
    );

    if (oldProductResult.isFailure()) {
      throw oldProductResult.getError();
    }

    const oldProduct = oldProductResult.getValue();

    const updatedProduct = Product.create(
      event.id,
      event.name ? event.name : oldProduct.getName(),
      event.description ? event.description : oldProduct.getDescription(),
      event.price ? event.price : oldProduct.getPrice(),
      event.stock ? event.stock : oldProduct.getStock(),
    );

    await this._odmProductRepository.updateProduct(updatedProduct);
  }
}
