import { ValueObject } from 'src/common/domain/value-object';
import { InvalidOrderItemQuantityException } from '../../exceptions/order-item/invalid-order-item-quantity.exception';

export class OrderItemQuantityVo extends ValueObject<OrderItemQuantityVo> {
  private value: number;

  private constructor(value: number) {
    super();
    if (value == null || value <= 0 || !Number.isInteger(value)) {
      throw new InvalidOrderItemQuantityException(
        'La cantidad del artículo debe ser un número entero mayor a 0.',
      );
    }
    this.value = value;
  }

  public getQuantity(): number {
    return this.value;
  }

  equals(obj: OrderItemQuantityVo): boolean {
    return this.value === obj.value;
  }

  static create(value: number): OrderItemQuantityVo {
    return new OrderItemQuantityVo(value);
  }
}
