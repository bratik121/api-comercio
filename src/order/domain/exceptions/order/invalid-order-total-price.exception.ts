import { BadRequestException } from 'src/common/exceptions/bad-request.exception';

export class InvalidOrderTotalPriceException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
