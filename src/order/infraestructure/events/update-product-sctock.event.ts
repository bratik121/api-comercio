import { IEventSubscriber } from 'src/common/aplication/events/event-suscriber.interface';
import { OrderRegisteredEvent } from 'src/order/domain/events/order-registered.event';
import { IOdmProductRepository } from 'src/products/domain/repositories/odm-product.repository.interface';
import { IOrmProductRepository } from 'src/products/domain/repositories/orm-product.repository.interface';
import { Product } from 'src/products/domain/product';
import { ProductStockVo } from 'src/products/domain/value-objects';
import { NotFoundProductException } from 'src/products/infraestructure/exceptions';
import { IEventPublisher } from 'src/common/aplication/events/event-publisher.interfaces';

export class UpdateProductStockEvent
  implements IEventSubscriber<OrderRegisteredEvent>
{
  private readonly _odmProductRepository: IOdmProductRepository;
  private readonly _ormProductRepository: IOrmProductRepository;
  private readonly eventPublisher: IEventPublisher;

  constructor(
    odmProductRepository: IOdmProductRepository,
    ormProductRepository: IOrmProductRepository,
    eventPublisher: IEventPublisher,
  ) {
    this._odmProductRepository = odmProductRepository;
    this._ormProductRepository = ormProductRepository;
    this.eventPublisher = eventPublisher;
  }

  async on(event: OrderRegisteredEvent): Promise<void> {
    console.log('UpdateProductStockEvent', event);
    for (const orderItem of event.orderItems) {
      const productId = orderItem.getProduct();
      const quantity = orderItem.getQuantity().getQuantity();

      const productResult =
        await this._odmProductRepository.findProductById(productId);

      if (productResult.isFailure()) {
        throw new NotFoundProductException(
          `Producto con ID ${productId.getId()} no encontrado`,
        );
      }

      const product = productResult.getValue();
      const currentStock = product.getStock().getStock();

      if (currentStock < quantity) {
        throw new Error(
          `Stock insuficiente para el producto con ID ${productId.getId()}`,
        );
      }

      const updatedStock = ProductStockVo.create(currentStock - quantity);
      product.Update(undefined, undefined, undefined, updatedStock);

      const saveResult =
        await this._ormProductRepository.updateProduct(product);

      if (saveResult.isFailure()) {
        throw saveResult.getError();
      }

      this.eventPublisher.publish(product.pullDomainEvents());
    }
  }
}
