import { BadRequestException } from 'src/common/exceptions/bad-request.exception';

export class InvalidOrderStatusException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
