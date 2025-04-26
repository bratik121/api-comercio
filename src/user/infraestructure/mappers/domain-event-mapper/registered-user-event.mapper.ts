import { UserRegisteredEvent } from 'src/user/domain/events';
import {
  UserEmailVo,
  UserNameVo,
  UserIdVo,
  UserPasswordVo,
} from 'src/user/domain/value-objects';

export function RegisteredUserMapper(
  json: Record<any, any>,
): UserRegisteredEvent {
  return UserRegisteredEvent.create(
    UserIdVo.create(json.id.value),
    UserNameVo.create(json.name.value),
    UserEmailVo.create(json.email.value),
    UserPasswordVo.create(json.password.value),
  );
}
