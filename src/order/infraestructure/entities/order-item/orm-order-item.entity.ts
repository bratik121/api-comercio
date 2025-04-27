import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrmOrderEntity } from '../order/orm-order.entity';
import { OrmProductEntity } from 'src/products/infraestructure/entities/orm-entities/orm-product.entity';

@Entity('order_item')
export class OrmOrderItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrmOrderEntity, (order) => order.orderItems, {
    onDelete: 'CASCADE',
  })
  order: OrmOrderEntity;

  @ManyToOne(() => OrmProductEntity, (product) => product.id, { eager: true })
  product: OrmProductEntity;

  @Column('decimal', { precision: 10, scale: 2 })
  purchasedPrice: number;

  @Column('int')
  quantity: number;

  static create(
    id: string,
    order: OrmOrderEntity,
    product: OrmProductEntity,
    purchasedPrice: number,
    quantity: number,
  ): OrmOrderItemEntity {
    const orderItem = new OrmOrderItemEntity();
    orderItem.id = id;
    orderItem.order = order;
    orderItem.product = product;
    orderItem.purchasedPrice = purchasedPrice;
    orderItem.quantity = quantity;

    return orderItem;
  }
}
