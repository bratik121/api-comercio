import { PersistenceException } from 'src/common/exceptions';

export class SaveUserException extends PersistenceException {
  constructor(message: string) {
    super(message);
  }
}
