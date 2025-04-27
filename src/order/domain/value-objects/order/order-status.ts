import { ValueObject } from 'src/common/domain/value-object';
import { InvalidOrderStatusException } from '../../exceptions';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED',
}

export class OrderStatusVo extends ValueObject<OrderStatusVo> {
  private value: OrderStatus;

  private constructor(value: OrderStatus) {
    super();
    if (!Object.values(OrderStatus).includes(value)) {
      throw new InvalidOrderStatusException(
        `El estado de la orden "${value}" no es válido.`,
      );
    }
    this.value = value;
  }

  public getStatus(): OrderStatus {
    return this.value;
  }

  equals(obj: OrderStatusVo): boolean {
    return this.value === obj.value;
  }

  static create(value: OrderStatus): OrderStatusVo {
    return new OrderStatusVo(value);
  }
}
