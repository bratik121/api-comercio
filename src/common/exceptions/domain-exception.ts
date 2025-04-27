import { Exception } from './exception';
import { ExeptionType } from './exception-type.enum';

export class DomainException extends Exception {
  constructor(message: string) {
    super(message);
    this.type = ExeptionType.DOMAIN_VALIDATION;
  }
}
