import { Prop, Schema, SchemaFactory, ModelDefinition } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'order_item', timestamps: true })
export class OdmOrderItemEntity {
  @Prop({ unique: true, required: true, type: Types.UUID })
  id: string;

  @Prop({ required: true, type: Types.UUID })
  orderId: string;

  @Prop({ required: true, type: Types.UUID })
  productId: string;

  @Prop({ required: true, type: Number })
  purchasedPrice: number;

  @Prop({ required: true, type: Number })
  quantity: number;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;

  static create(
    id: string,
    orderId: string,
    productId: string,
    purchasedPrice: number,
    quantity: number,
  ): OdmOrderItemEntity {
    const orderItem = new OdmOrderItemEntity();
    orderItem.id = id;
    orderItem.orderId = orderId;
    orderItem.productId = productId;
    orderItem.purchasedPrice = purchasedPrice;
    orderItem.quantity = quantity;
    return orderItem;
  }
}

export const OdmOrderItemEntitySchema =
  SchemaFactory.createForClass(OdmOrderItemEntity);

export const OdmOrderItemEntityModel: ModelDefinition = {
  name: 'order_item',
  schema: OdmOrderItemEntitySchema,
};
