import { PersistenceException } from 'src/common/exceptions';

export class UpdateProductException extends PersistenceException {
  constructor(message: string) {
    super(message);
  }
}
