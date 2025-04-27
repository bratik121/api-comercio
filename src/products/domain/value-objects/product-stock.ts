import { ValueObject } from 'src/common/domain/value-object';
import { InvalidProductStockException } from '../exceptions';

export class ProductStockVo extends ValueObject<ProductStockVo> {
  private value: number;

  private constructor(value: number) {
    super();
    if (value == null || value < 0) {
      throw new InvalidProductStockException(
        'El stock del producto debe ser un número mayor o igual a 0',
      );
    }

    this.value = value;
  }

  public getStock(): number {
    return this.value;
  }

  equals(obj: ProductStockVo): boolean {
    return this.value === obj.value;
  }

  static create(value: number): ProductStockVo {
    return new ProductStockVo(value);
  }
}
