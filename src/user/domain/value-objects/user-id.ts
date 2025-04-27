import { ValueObject } from 'src/common/domain/value-object';
import { InvalidUserIdException } from '../exceptions/';

export class UserIdVo extends ValueObject<UserIdVo> {
  private value: string;
  private constructor(value: string) {
    super();
    if (!value) {
      throw new InvalidUserIdException('Debe introducir un id del usuario');
    }
    this.value = value;
  }

  equals(obj: UserIdVo): boolean {
    return this.value === obj.value;
  }

  public getId(): string {
    return this.value;
  }

  static create(value: string): UserIdVo {
    return new UserIdVo(value);
  }
}
