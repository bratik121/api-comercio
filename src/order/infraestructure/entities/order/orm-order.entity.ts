import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrmOrderItemEntity } from '../order-item/';
import { OrmUserEntity } from 'src/user/infraestructure/entities/orm-entities/orm-user.entity';
import { OrderStatus } from 'src/order/domain/value-objects';

@Entity('order')
export class OrmOrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrmUserEntity, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'id_user' })
  user: OrmUserEntity;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @OneToMany(() => OrmOrderItemEntity, (orderItem) => orderItem.order, {
    cascade: true,
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

  @Column({ type: 'uuid' })
  id_user: string;

  static create(
    id: string,
    id_user: string,
    status: OrderStatus,
    totalPrice: number,
  ): OrmOrderEntity {
    const order = new OrmOrderEntity();
    order.id = id;
    order.id_user = id_user;
    order.status = status;
    order.totalPrice = totalPrice;

    return order;
  }
}
