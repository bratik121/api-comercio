import { BadRequestException } from 'src/common/exceptions/bad-request.exception';

export class InvalidUserEmailException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
