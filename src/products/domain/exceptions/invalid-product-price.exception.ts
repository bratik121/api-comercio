import { BadRequestException } from 'src/common/exceptions/bad-request.exception';

export class InvalidProductPriceException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
