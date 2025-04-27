import { PersistenceException } from 'src/common/exceptions';

export class SaveProductException extends PersistenceException {
  constructor(message: string) {
    super(message);
  }
}
