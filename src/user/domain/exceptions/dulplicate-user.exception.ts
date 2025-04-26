import { ConflictException } from 'src/common/exceptions/conflict.exception';

export class DuplicateUserException extends ConflictException {
  constructor(msg: string) {
    super(msg);
  }
}
