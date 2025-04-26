import { ValueObject } from 'src/common/domain/value-object';
import { InvalidUserNameException } from '../exceptions';
import { MyString, validName } from 'src/common/utils';

export class UserNameVo extends ValueObject<UserNameVo> {
  private value: string;

  private constructor(value: string) {
    super();
    if (!value) {
      throw new InvalidUserNameException(
        'Debe introducir el nombre de usuario',
      );
    }

    if (value.length < 3) {
      throw new InvalidUserNameException(
        'El nombre del usuario debe tener al menos 3 caracteres',
      );
    }

    if (validName(value)) {
      throw new InvalidUserNameException(
        'El nombre del usuario solo puede contener letras y espacios',
      );
    }

    this.value = MyString.capitalize(value);
  }

  public getName(): string {
    return this.value;
  }

  equals(obj: UserNameVo): boolean {
    return this.value === obj.value;
  }

  static create(value: string): UserNameVo {
    return new UserNameVo(value);
  }
}
