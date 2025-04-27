import { DomainEvent } from 'src/common/domain/domain-event';
import { ProductIdVo } from '../value-objects';

export class ProductDeletedEvent extends DomainEvent {
  private constructor(public readonly id: ProductIdVo) {
    super();
  }

  serialize(): string {
    return JSON.stringify({
      id: this.id,
    });
  }

  static create(id: ProductIdVo): ProductDeletedEvent {
    return new ProductDeletedEvent(id);
  }
}
