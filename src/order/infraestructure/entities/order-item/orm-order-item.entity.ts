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

  @Column({ type: 'uuid' })
  id_order: string;

  @Column({ type: 'uuid' })
  id_product: string;

  @Column('int')
  quantity: number;

  static create(
    id: string,
    id_order: string,
    id_product: string,
    purchasedPrice: number,
    quantity: number,
  ): OrmOrderItemEntity {
    const orderItem = new OrmOrderItemEntity();
    orderItem.id = id;
    orderItem.id_order = id_order;
    orderItem.id_product = id_product;
    orderItem.purchasedPrice = purchasedPrice;
    orderItem.quantity = quantity;

    return orderItem;
  }
}
