import { UserEmailVo, UserIdVo } from '../value-objects';
import { User } from '../user';
import { Result } from 'src/common/abstractions/result';

export interface IOrmUserRepository {
  findUserById(id: UserIdVo): Promise<Result<User>>;
  findUserByEmail(email: UserEmailVo): Promise<Result<User>>;
  findAllUser(): Promise<Result<User[]>>;
  saveUser(user: User): Promise<Result<User>>;
}
