import { NotFoundException } from 'src/common/exceptions';

export class NotFoundUserException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
