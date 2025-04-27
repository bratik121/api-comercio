import { ValueObject } from 'src/common/domain/value-object';
import { InvalidOrderItemPurchasedPriceException } from '../../exceptions/order-item/invalid-order-item-purchased-price.exception';

export class OrderItemPurchasedPriceVo extends ValueObject<OrderItemPurchasedPriceVo> {
  private value: number;

  private constructor(value: number) {
    super();
    if (value == null || value <= 0) {
      throw new InvalidOrderItemPurchasedPriceException(
        'El precio de compra del artículo debe ser un número mayor a 0.',
      );
    }
    this.value = value;
  }

  public getPurchasedPrice(): number {
    return this.value;
  }

  equals(obj: OrderItemPurchasedPriceVo): boolean {
    return this.value === obj.value;
  }

  static create(value: number): OrderItemPurchasedPriceVo {
    return new OrderItemPurchasedPriceVo(value);
  }
}
