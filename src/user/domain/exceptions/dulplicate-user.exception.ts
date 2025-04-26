import { ConflictException } from '@nestjs/common/exceptions';

export class DuplicateUserException extends ConflictException {
  constructor(msg: string) {
    super(msg);
  }
}
