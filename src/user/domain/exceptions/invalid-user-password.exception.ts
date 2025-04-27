import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

export class InvalidUserPasswordException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
