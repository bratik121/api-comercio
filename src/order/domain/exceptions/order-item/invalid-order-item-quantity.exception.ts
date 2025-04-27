import { BadRequestException } from 'src/common/exceptions/bad-request.exception';

export class InvalidOrderItemQuantityException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
