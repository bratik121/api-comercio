import { DomainEvent } from 'src/common/domain/domain-event';
import {
  UserEmailVo,
  UserIdVo,
  UserNameVo,
  UserPasswordVo,
} from '../value-objects';

export class UserRegisteredEvent extends DomainEvent {
  private constructor(
    public readonly id: UserIdVo,
    public readonly name: UserNameVo,
    public readonly email: UserEmailVo,
    public readonly password: UserPasswordVo,
  ) {
    super();
  }

  static create(
    id: UserIdVo,
    name: UserNameVo,
    email: UserEmailVo,
    password: UserPasswordVo,
  ): UserRegisteredEvent {
    return new UserRegisteredEvent(id, name, email, password);
  }

  serialize(): string {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
    });
  }
}
