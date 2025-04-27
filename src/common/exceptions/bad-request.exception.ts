import { Exception } from './exception';
import { ExeptionType } from './exception-type.enum';

export class BadRequestException extends Exception {
  constructor(message: string) {
    super(message);
    this.type = ExeptionType.BAD_REQUEST;
  }
}
