import { ValueObject } from 'src/common/domain/value-object';
import { InvalidProductIdException } from '../exceptions';

export class ProductIdVo extends ValueObject<ProductIdVo> {
  private value: string;

  private constructor(value: string) {
    super();
    if (!value || value.trim() === '') {
      throw new InvalidProductIdException(
        'El ID del producto no puede estar vacío',
      );
    }

    this.value = value;
  }

  public getId(): string {
    return this.value;
  }

  equals(obj: ProductIdVo): boolean {
    return this.value === obj.value;
  }

  static create(value: string): ProductIdVo {
    return new ProductIdVo(value);
  }
}
