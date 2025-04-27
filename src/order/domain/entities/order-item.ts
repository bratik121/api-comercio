import { Entity } from 'src/common/domain/entity';
import {
  OrderItemIdVo,
  OrderItemPurchasedPriceVo,
  OrderItemQuantityVo,
} from '../value-objects/order-item';
import { ProductIdVo } from 'src/products/domain/value-objects';

export class OrderItem extends Entity<OrderItemIdVo> {
  private product: ProductIdVo;
  private purchasedPrice: OrderItemPurchasedPriceVo;
  private quantity: OrderItemQuantityVo;

  private constructor(
    id: OrderItemIdVo,
    product: ProductIdVo,
    purchasedPrice: OrderItemPurchasedPriceVo,
    quantity: OrderItemQuantityVo,
  ) {
    super(id);
    this.product = product;
    this.purchasedPrice = purchasedPrice;
    this.quantity = quantity;
  }

  public getProduct(): ProductIdVo {
    return this.product;
  }

  public getPurchasedPrice(): OrderItemPurchasedPriceVo {
    return this.purchasedPrice;
  }

  public getQuantity(): OrderItemQuantityVo {
    return this.quantity;
  }

  static create(
    id: OrderItemIdVo,
    product: ProductIdVo,
    purchasedPrice: OrderItemPurchasedPriceVo,
    quantity: OrderItemQuantityVo,
  ): OrderItem {
    return new OrderItem(id, product, purchasedPrice, quantity);
  }
}
