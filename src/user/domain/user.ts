import {
  UserEmailVo,
  UserIdVo,
  UserNameVo,
  UserPasswordVo,
} from './value-objects';
import { DomainEvent } from 'src/common/domain/domain-event';
import { UserCreatedEvent, UserRegisteredEvent } from './events';
import { AggregateRoot } from 'src/common/domain/aggregate-root';

export class User extends AggregateRoot<UserIdVo> {
  private name: UserNameVo;
  private email: UserEmailVo;
  private password: UserPasswordVo;

  private constructor(
    id: UserIdVo,
    name: UserNameVo,
    email: UserEmailVo,
    password: UserPasswordVo,
  ) {
    super(id, UserCreatedEvent.create(id, name, email, password));
    this.name = name;
    this.email = email;
    this.password = password;
  }
  protected when(event: DomainEvent): void {
    if (event instanceof UserCreatedEvent) {
      this.name = event.name;
      this.email = event.email;
      this.password = event.password;
    }
  }
  protected validateState(): void {}

  public getName(): UserNameVo {
    return this.name;
  }

  public getEmail(): UserEmailVo {
    return this.email;
  }

  public getPassword(): UserPasswordVo {
    return this.password;
  }

  static create(
    id: UserIdVo,
    name: UserNameVo,
    email: UserEmailVo,
    password: UserPasswordVo,
  ): User {
    return new User(id, name, email, password);
  }

  Register() {
    this.apply(
      UserRegisteredEvent.create(
        this.getId(),
        this.name,
        this.email,
        this.password,
      ),
    );
  }
}
