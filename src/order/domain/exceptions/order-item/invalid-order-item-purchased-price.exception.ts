import { BadRequestException } from 'src/common/exceptions/bad-request.exception';

export class InvalidOrderItemPurchasedPriceException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
