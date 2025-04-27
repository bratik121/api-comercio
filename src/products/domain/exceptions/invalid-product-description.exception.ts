import { BadRequestException } from 'src/common/exceptions/bad-request.exception';

export class InvalidProductDescriptionException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
