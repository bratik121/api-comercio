import { DomainEvent } from 'src/common/domain/domain-event';
import {
  ProductIdVo,
  ProductNameVo,
  ProductDescriptionVo,
  ProductPriceVo,
  ProductStockVo,
} from '../value-objects';

export class ProductUpdatedEvent extends DomainEvent {
  private constructor(
    public readonly id: ProductIdVo,
    public readonly name?: ProductNameVo,
    public readonly description?: ProductDescriptionVo,
    public readonly price?: ProductPriceVo,
    public readonly stock?: ProductStockVo,
  ) {
    super();
  }

  serialize(): string {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      stock: this.stock,
    });
  }

  static create(
    id: ProductIdVo,
    name?: ProductNameVo,
    description?: ProductDescriptionVo,
    price?: ProductPriceVo,
    stock?: ProductStockVo,
  ): ProductUpdatedEvent {
    return new ProductUpdatedEvent(id, name, description, price, stock);
  }
}
