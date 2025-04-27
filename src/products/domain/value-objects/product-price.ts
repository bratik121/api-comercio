import { ValueObject } from 'src/common/domain/value-object';
import { InvalidProductPriceException } from '../exceptions';

export class ProductPriceVo extends ValueObject<ProductPriceVo> {
  private value: number;

  private constructor(value: number) {
    super();
    if (value == null || value <= 0) {
      throw new InvalidProductPriceException(
        'El precio del producto debe ser un número mayor a 0',
      );
    }

    this.value = value;
  }

  public getPrice(): number {
    return this.value;
  }

  equals(obj: ProductPriceVo): boolean {
    return this.value === obj.value;
  }

  static create(value: number): ProductPriceVo {
    return new ProductPriceVo(value);
  }
}
