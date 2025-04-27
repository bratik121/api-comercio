import { BadRequestException } from 'src/common/exceptions/bad-request.exception';

export class InvalidOrderItemIdException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
