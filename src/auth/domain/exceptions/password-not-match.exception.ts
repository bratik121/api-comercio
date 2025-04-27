import { UnauthorizedException } from 'src/common/exceptions/unauthorized.exception';

export class PasswordNotMatchException extends UnauthorizedException {
  constructor(message: string) {
    super(message);
  }
}
