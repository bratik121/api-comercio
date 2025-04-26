import { ValueObject } from 'src/common/domain/value-object';
import { InvalidUserPasswordException } from '../exceptions';

export class UserPasswordVo extends ValueObject<UserPasswordVo> {
  private value: string;

  private constructor(value: string) {
    super();
    if (value) {
      if (value.length < 8) {
        throw new InvalidUserPasswordException(
          'La contraseña debe tener al menos 8 caracteres',
        );
      }
    }
    this.value = value;
  }

  public getPassword(): string {
    return this.value;
  }

  equals(obj: UserPasswordVo): boolean {
    return this.value === obj.value;
  }

  static create(value: string): UserPasswordVo {
    return new UserPasswordVo(value);
  }
}
