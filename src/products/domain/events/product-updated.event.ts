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
      id: this.id.getId(),
      name: this.name?.getName(),
      description: this.description?.getDescription(),
      price: this.price?.getPrice(),
      stock: this.stock?.getStock(),
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
