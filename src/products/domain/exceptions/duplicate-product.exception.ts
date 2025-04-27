import { ConflictException } from 'src/common/exceptions/conflict.exception';

export class DuplicateProductException extends ConflictException {
  constructor(msg: string) {
    super(msg);
  }
}
