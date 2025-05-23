import { DomainEvent } from 'src/common/domain/domain-event';
import {
  ProductIdVo,
  ProductNameVo,
  ProductDescriptionVo,
  ProductPriceVo,
  ProductStockVo,
} from '../value-objects';

export class ProductCreatedEvent extends DomainEvent {
  private constructor(
    public readonly id: ProductIdVo,
    public readonly name: ProductNameVo,
    public readonly description: ProductDescriptionVo,
    public readonly price: ProductPriceVo,
    public readonly stock: ProductStockVo,
  ) {
    super();
  }

  static create(
    id: ProductIdVo,
    name: ProductNameVo,
    description: ProductDescriptionVo,
    price: ProductPriceVo,
    stock: ProductStockVo,
  ): ProductCreatedEvent {
    return new ProductCreatedEvent(id, name, description, price, stock);
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
}
