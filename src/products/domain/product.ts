import {
  ProductIdVo,
  ProductNameVo,
  ProductDescriptionVo,
  ProductPriceVo,
  ProductStockVo,
} from './value-objects';
import { AggregateRoot } from 'src/common/domain/aggregate-root';
import {
  ProductCreatedEvent,
  ProductRegistered,
  ProductUpdatedEvent,
} from './events';
import { DomainEvent } from 'src/common/domain/domain-event';

export class Product extends AggregateRoot<ProductIdVo> {
  private name: ProductNameVo;
  private description: ProductDescriptionVo;
  private price: ProductPriceVo;
  private stock: ProductStockVo;

  private constructor(
    id: ProductIdVo,
    name: ProductNameVo,
    description: ProductDescriptionVo,
    price: ProductPriceVo,
    stock: ProductStockVo,
  ) {
    super(id, ProductCreatedEvent.create(id, name, description, price, stock));
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
  }

  protected when(event: DomainEvent): void {
    if (event instanceof ProductCreatedEvent) {
      this.name = event.name;
      this.description = event.description;
      this.price = event.price;
      this.stock = event.stock;
    }

    if (event instanceof ProductUpdatedEvent) {
      if (event.name) {
        this.name = event.name;
      }
      if (event.description) {
        this.description = event.description;
      }
      if (event.price) {
        this.price = event.price;
      }
      if (event.stock) {
        this.stock = event.stock;
      }
    }
  }

  protected validateState(): void {}

  public getName(): ProductNameVo {
    return this.name;
  }

  public getDescription(): ProductDescriptionVo {
    return this.description;
  }

  public getPrice(): ProductPriceVo {
    return this.price;
  }

  public getStock(): ProductStockVo {
    return this.stock;
  }

  Register() {
    this.apply(
      ProductRegistered.create(
        this.getId(),
        this.name,
        this.description,
        this.price,
        this.stock,
      ),
    );
  }

  Update(
    name?: ProductNameVo,
    description?: ProductDescriptionVo,
    price?: ProductPriceVo,
    stock?: ProductStockVo,
  ) {
    this.apply(
      ProductUpdatedEvent.create(this.getId(), name, description, price, stock),
    );
  }

  static create(
    id: ProductIdVo,
    name: ProductNameVo,
    description: ProductDescriptionVo,
    price: ProductPriceVo,
    stock: ProductStockVo,
  ): Product {
    return new Product(id, name, description, price, stock);
  }
}
