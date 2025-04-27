import { Prop, Schema, SchemaFactory, ModelDefinition } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { OdmOrderItemEntity } from '../order-item/odm-order-item.entity';
import { OrderStatus } from 'src/order/domain/value-objects';

@Schema({ collection: 'order', timestamps: true })
export class OdmOrderEntity {
  @Prop({ unique: true, required: true, type: Types.UUID })
  id: string;

  @Prop({ required: true, type: Types.UUID })
  userId: string;

  @Prop({ required: true, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ required: true, type: Number })
  totalPrice: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'order_item' }], default: [] })
  orderItems: OdmOrderItemEntity[];

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;

  static create(
    id: string,
    userId: string,
    status: OrderStatus,
    totalPrice: number,
  ): OdmOrderEntity {
    const order = new OdmOrderEntity();
    order.id = id;
    order.userId = userId;
    order.status = status;
    order.totalPrice = totalPrice;
    return order;
  }
}

export const OdmOrderEntitySchema =
  SchemaFactory.createForClass(OdmOrderEntity);

OdmOrderEntitySchema.pre('deleteOne', async function (next) {
  const orderId = this.getQuery().id;

  await this.model.db.model('order_item').deleteMany({
    orderId: orderId,
  });

  next();
});

export const OdmOrderEntityModel: ModelDefinition = {
  name: 'order',
  schema: OdmOrderEntitySchema,
};
