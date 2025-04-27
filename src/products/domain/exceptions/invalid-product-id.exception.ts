import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

export class InvalidProductIdException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
