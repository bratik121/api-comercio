import { Entity } from 'src/common/domain/entity';
import {
  OrderItemIdVo,
  OrderItemPurchasedPriceVo,
  OrderItemQuantityVo,
} from '../value-objects/order-item';
import { ProductIdVo } from 'src/products/domain/value-objects';
import { OrderIdVo } from '../value-objects';

export class OrderItem extends Entity<OrderItemIdVo> {
  private order: OrderIdVo;
  private product: ProductIdVo;
  private purchasedPrice: OrderItemPurchasedPriceVo;
  private quantity: OrderItemQuantityVo;

  private constructor(
    id: OrderItemIdVo,
    order: OrderIdVo,
    product: ProductIdVo,
    purchasedPrice: OrderItemPurchasedPriceVo,
    quantity: OrderItemQuantityVo,
  ) {
    super(id);
    this.order = order;
    this.product = product;
    this.purchasedPrice = purchasedPrice;
    this.quantity = quantity;
  }

  public getOrder(): OrderIdVo {
    return this.order;
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
    order: OrderIdVo,
    product: ProductIdVo,
    purchasedPrice: OrderItemPurchasedPriceVo,
    quantity: OrderItemQuantityVo,
  ): OrderItem {
    return new OrderItem(id, order, product, purchasedPrice, quantity);
  }
}
