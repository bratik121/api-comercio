import { BadRequestException } from 'src/common/exceptions/bad-request.exception';

export class InvalidProductStockException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
