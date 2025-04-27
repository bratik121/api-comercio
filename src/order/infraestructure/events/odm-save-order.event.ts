import { IEventSubscriber } from 'src/common/aplication/events/event-suscriber.interface';
import { OrderRegisteredEvent } from 'src/order/domain/events/order-registered.event';
import { IOdmOrderRepository } from 'src/order/domain/repositories/order/odm-order.repository.interface';
import { IOdmOrderItemRepository } from 'src/order/domain/repositories/order-item/odm-order-item.repository.interface';
import { Order } from 'src/order/domain/order';
import { OrderItem } from 'src/order/domain/entities/order-item';

export class OdmSaveOrderEvent
  implements IEventSubscriber<OrderRegisteredEvent>
{
  constructor(
    private readonly _odmOrderRepository: IOdmOrderRepository,
    private readonly _odmOrderItemRepository: IOdmOrderItemRepository,
  ) {}

  async on(event: OrderRegisteredEvent): Promise<void> {
    const orderItems: OrderItem[] = event.orderItems.map((item) =>
      OrderItem.create(
        item.getId(),
        event.id,
        item.getProduct(),
        item.getPurchasedPrice(),
        item.getQuantity(),
      ),
    );

    const order = Order.create(
      event.id,
      event.user,
      event.status,
      event.totalPrice,
      orderItems,
    );

    await this._odmOrderRepository.saveOrder(order);

    for (const orderItem of orderItems) {
      await this._odmOrderItemRepository.saveOrderItem(orderItem);
    }
  }
}
