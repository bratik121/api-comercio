import { OrmOrderItemEntity } from 'src/order/infraestructure/entities/order-item';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product')
export class OrmProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  stock: number;

  @OneToMany(() => OrmOrderItemEntity, (orderItem) => orderItem.product, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  orderItems: OrmOrderItemEntity[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;

  static create(
    id: string,
    name: string,
    description: string,
    price: number,
    stock: number,
  ): OrmProductEntity {
    const product = new OrmProductEntity();
    product.id = id;
    product.name = name;
    product.description = description;
    product.price = price;
    product.stock = stock;

    return product;
  }
}
