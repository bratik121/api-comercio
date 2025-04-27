import { AggregateRoot } from 'src/common/domain/aggregate-root';
import {
  OrderIdVo,
  OrderStatusVo,
  OrderTotalPriceVo,
} from './value-objects/order';
import { OrderItem } from './entities/order-item';
import { CreatedOrderEvent, RegisteredOrderEvent } from './events';
import { DomainEvent } from 'src/common/domain/domain-event';
import { UserIdVo } from 'src/user/domain/value-objects';

export class Order extends AggregateRoot<OrderIdVo> {
  private user: UserIdVo;
  private status: OrderStatusVo;
  private totalPrice: OrderTotalPriceVo;
  private orderItems: OrderItem[];

  private constructor(
    id: OrderIdVo,
    user: UserIdVo,
    status: OrderStatusVo,
    totalPrice: OrderTotalPriceVo,
    orderItems: OrderItem[],
  ) {
    super(
      id,
      CreatedOrderEvent.create(id, user, status, totalPrice, orderItems),
    );
    this.status = status;
    this.user = user;
    this.totalPrice = totalPrice;
    this.orderItems = orderItems;
  }

  public getUser(): UserIdVo {
    return this.user;
  }

  public getStatus(): OrderStatusVo {
    return this.status;
  }

  public getTotalPrice(): OrderTotalPriceVo {
    return this.totalPrice;
  }

  public getOrderItems(): OrderItem[] {
    return this.orderItems;
  }

  protected when(event: DomainEvent): void {
    if (event instanceof CreatedOrderEvent) {
      this.user = event.user;
      this.status = event.status;
      this.totalPrice = event.totalPrice;
      this.orderItems = event.orderItems;
    }
  }

  protected validateState(): void {}

  Register(): void {
    this.apply(
      RegisteredOrderEvent.create(
        this.getId(),
        this.user,
        this.status,
        this.totalPrice,
        this.orderItems,
      ),
    );
  }

  static create(
    id: OrderIdVo,
    user: UserIdVo,
    status: OrderStatusVo,
    totalPrice: OrderTotalPriceVo,
    orderItems: OrderItem[],
  ): Order {
    return new Order(id, user, status, totalPrice, orderItems);
  }
}
