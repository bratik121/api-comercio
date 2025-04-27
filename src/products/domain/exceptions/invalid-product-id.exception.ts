import { BadRequestException } from 'src/common/exceptions/bad-request.exception';

export class InvalidProductIdException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
