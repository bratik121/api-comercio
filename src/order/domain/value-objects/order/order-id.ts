import { ValueObject } from 'src/common/domain/value-object';
import { InvalidOrderIdException } from '../../exceptions/order/invalid-order-id.exception';

export class OrderIdVo extends ValueObject<OrderIdVo> {
  private value: string;

  private constructor(value: string) {
    super();
    if (!value || value.trim() === '') {
      throw new InvalidOrderIdException(
        'El ID de la orden no puede estar vacío.',
      );
    }

    this.value = value;
  }

  public getId(): string {
    return this.value;
  }

  equals(obj: OrderIdVo): boolean {
    return this.value === obj.value;
  }

  static create(value: string): OrderIdVo {
    return new OrderIdVo(value);
  }
}
