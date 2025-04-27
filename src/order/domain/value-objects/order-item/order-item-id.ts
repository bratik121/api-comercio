import { ValueObject } from 'src/common/domain/value-object';
import { InvalidOrderItemIdException } from '../../exceptions/order-item/invalid-order-item-id.exception';

export class OrderItemIdVo extends ValueObject<OrderItemIdVo> {
  private value: string;

  private constructor(value: string) {
    super();
    if (!value || value.trim() === '') {
      throw new InvalidOrderItemIdException(
        'El ID del artículo de la orden no puede estar vacío.',
      );
    }

    this.value = value;
  }

  public getId(): string {
    return this.value;
  }

  equals(obj: OrderItemIdVo): boolean {
    return this.value === obj.value;
  }

  static create(value: string): OrderItemIdVo {
    return new OrderItemIdVo(value);
  }
}
