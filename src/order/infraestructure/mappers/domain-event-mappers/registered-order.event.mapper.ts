import { OrderRegisteredEvent } from 'src/order/domain/events/order-registered.event';
import {
  OrderIdVo,
  OrderStatusVo,
  OrderTotalPriceVo,
} from 'src/order/domain/value-objects/order';
import { UserIdVo } from 'src/user/domain/value-objects';
import { OrderItem } from 'src/order/domain/entities/order-item';
import {
  OrderItemIdVo,
  OrderItemPurchasedPriceVo,
  OrderItemQuantityVo,
} from 'src/order/domain/value-objects/order-item';
import { ProductIdVo } from 'src/products/domain/value-objects';

export function RegisteredOrderEventMapper(
  json: Record<any, any>,
): OrderRegisteredEvent {
  const orderItems = json.orderItems.map((item: any) =>
    OrderItem.create(
      OrderItemIdVo.create(item.id.value),
      OrderIdVo.create(json.id.value),
      ProductIdVo.create(item.product.value),
      OrderItemPurchasedPriceVo.create(item.purchasedPrice.value),
      OrderItemQuantityVo.create(item.quantity.value),
    ),
  );

  return OrderRegisteredEvent.create(
    OrderIdVo.create(json.id.value),
    UserIdVo.create(json.user.value),
    OrderStatusVo.create(json.status.value),
    OrderTotalPriceVo.create(json.totalPrice.value),
    orderItems,
  );
}
