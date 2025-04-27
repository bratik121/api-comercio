import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

export class InvalidUserNameException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
