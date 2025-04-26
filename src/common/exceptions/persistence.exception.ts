import { Exception } from './exception';
import { ExeptionType } from './exception-type.enum';
export class PersistenceException extends Exception {
  constructor(message: string) {
    super(message);
    this.type = ExeptionType.PERSISTENCE;
  }
}
