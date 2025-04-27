import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

export class InvalidProductNameException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
