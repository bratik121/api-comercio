import { ValueObject } from 'src/common/domain/value-object';
import { InvalidUserEmailException } from '../exceptions';
import { validEmail } from 'src/common/utils/regex-validations';

export class UserEmailVo extends ValueObject<UserEmailVo> {
  private value: string;

  private constructor(value: string) {
    super();
    if (!value) {
      throw new InvalidUserEmailException('Debe introducir el email');
    }

    if (value.length < 3) {
      throw new InvalidUserEmailException(
        'El email debe tener al menos 3 caracteres',
      );
    }

    if (validEmail(value)) {
      throw new InvalidUserEmailException(
        'El email debe tener un formato válido: ejemplo@dominio.com',
      );
    }

    this.value = value;
  }

  public getEmail(): string {
    return this.value;
  }

  equals(obj: UserEmailVo): boolean {
    return this.value === obj.value;
  }

  static create(value: string): UserEmailVo {
    return new UserEmailVo(value);
  }
}
