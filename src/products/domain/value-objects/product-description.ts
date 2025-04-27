import { ValueObject } from 'src/common/domain/value-object';
import { InvalidProductDescriptionException } from '../exceptions';
import { MyString } from 'src/common/utils';

export class ProductDescriptionVo extends ValueObject<ProductDescriptionVo> {
  private value: string;

  private constructor(value: string) {
    super();
    if (!value || value.trim() === '') {
      throw new InvalidProductDescriptionException(
        'La descripción del producto no puede estar vacía',
      );
    }

    if (value.length < 10) {
      throw new InvalidProductDescriptionException(
        'La descripción del producto debe tener al menos 10 caracteres',
      );
    }

    this.value = MyString.capitalize(value);
  }

  public getDescription(): string {
    return this.value;
  }

  equals(obj: ProductDescriptionVo): boolean {
    return this.value === obj.value;
  }

  static create(value: string): ProductDescriptionVo {
    return new ProductDescriptionVo(value);
  }
}
