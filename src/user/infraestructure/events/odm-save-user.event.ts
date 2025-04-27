import { IEventSubscriber } from 'src/common/aplication/events/event-suscriber.interface';
import { UserRegisteredEvent } from 'src/user/domain/events';
import { IOdmUserRepository } from 'src/user/domain/repositories';
import { User } from 'src/user/domain/user';

export class OdmSaveUserEvent implements IEventSubscriber<UserRegisteredEvent> {
  constructor(private readonly _odmUserRepository: IOdmUserRepository) {}

  async on(event: UserRegisteredEvent): Promise<void> {
    const user = User.create(event.id, event.name, event.email, event.password);
    this._odmUserRepository.saveUser(user);
  }
}
