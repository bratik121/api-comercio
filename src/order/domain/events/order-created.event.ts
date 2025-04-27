import { DomainEvent } from 'src/common/domain/domain-event';
import {
  OrderIdVo,
  OrderStatusVo,
  OrderTotalPriceVo,
} from '../value-objects/order';
import { OrderItem } from '../entities/order-item';
import { UserIdVo } from 'src/user/domain/value-objects';

export class OrderCreatedEvent extends DomainEvent {
  private constructor(
    public readonly id: OrderIdVo,
    public readonly user: UserIdVo,
    public readonly status: OrderStatusVo,
    public readonly totalPrice: OrderTotalPriceVo,
    public readonly orderItems: OrderItem[],
  ) {
    super();
  }

  serialize(): string {
    return JSON.stringify({
      id: this.id,
      user: this.user,
      status: this.status,
      totalPrice: this.totalPrice,
      orderItems: this.orderItems.map((item) => ({
        id: item.getId(),
        product: item.getProduct(),
        purchasedPrice: item.getPurchasedPrice(),
        quantity: item.getQuantity(),
      })),
    });
  }

  static create(
    id: OrderIdVo,
    user: UserIdVo,
    status: OrderStatusVo,
    totalPrice: OrderTotalPriceVo,
    orderItems: OrderItem[],
  ): OrderCreatedEvent {
    return new OrderCreatedEvent(id, user, status, totalPrice, orderItems);
  }
}
