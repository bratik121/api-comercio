import { BadRequestException } from 'src/common/exceptions/bad-request.exception';

export class InvalidUserNameException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
