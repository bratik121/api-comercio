import { BadRequestException } from 'src/common/exceptions/bad-request.exception';

export class InvalidUserIdException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
