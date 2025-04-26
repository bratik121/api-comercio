import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

export class InvalidUserIdException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
