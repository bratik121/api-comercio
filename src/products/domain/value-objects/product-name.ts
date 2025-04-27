import { ValueObject } from 'src/common/domain/value-object';
import { InvalidProductNameException } from '../exceptions';
import { MyString, validName } from 'src/common/utils';

export class ProductNameVo extends ValueObject<ProductNameVo> {
  private value: string;

  private constructor(value: string) {
    super();
    if (!value || value.trim() === '') {
      throw new InvalidProductNameException(
        'El nombre del producto no puede estar vacío',
      );
    }

    if (value.length < 3) {
      throw new InvalidProductNameException(
        'El nombre del producto debe tener al menos 3 caracteres',
      );
    }

    if (validName(value)) {
      throw new InvalidProductNameException(
        'El nombre del producto solo puede contener letras y espacios',
      );
    }

    this.value = MyString.capitalize(value);
  }

  public getName(): string {
    return this.value;
  }

  equals(obj: ProductNameVo): boolean {
    return this.value === obj.value;
  }

  static create(value: string): ProductNameVo {
    return new ProductNameVo(value);
  }
}
