import { ValueObject } from 'src/common/domain/value-object';
import { InvalidOrderTotalPriceException } from '../../exceptions';

export class OrderTotalPriceVo extends ValueObject<OrderTotalPriceVo> {
  private value: number;

  private constructor(value: number) {
    super();
    if (value == null || value <= 0) {
      throw new InvalidOrderTotalPriceException(
        'El precio total de la orden debe ser un número mayor a 0.',
      );
    }
    this.value = value;
  }

  public getTotalPrice(): number {
    return this.value;
  }

  equals(obj: OrderTotalPriceVo): boolean {
    return this.value === obj.value;
  }

  static create(value: number): OrderTotalPriceVo {
    return new OrderTotalPriceVo(value);
  }
}
