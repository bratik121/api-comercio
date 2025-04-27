import { DomainException } from 'src/common/exceptions/domain-exception';

export class InsufficientStockForOrderException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
