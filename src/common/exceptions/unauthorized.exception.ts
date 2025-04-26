import { Exception } from './exception';
import { ExeptionType } from './exception-type.enum';

export class UnauthorizedException extends Exception {
  constructor(message: string) {
    super(message);
    this.type = ExeptionType.UNAUTHORIZED;
  }
}
