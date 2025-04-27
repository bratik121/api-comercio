import { NotFoundException } from 'src/common/exceptions';

export class NotFoundProductException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
