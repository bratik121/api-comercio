import { Exception } from './exception';
import { ExeptionType } from './exception-type.enum';

export class NotFoundException extends Exception {
  constructor(message: string) {
    super(message);
    this.type = ExeptionType.NOT_FOUND;
  }
}
