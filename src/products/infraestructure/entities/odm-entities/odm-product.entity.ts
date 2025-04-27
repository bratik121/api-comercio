import { Prop, Schema, SchemaFactory, ModelDefinition } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { OdmOrderItemEntity } from 'src/order/infraestructure/entities/order-item/odm-order-item.entity';

@Schema({ collection: 'product', timestamps: true })
export class OdmProductEntity {
  @Prop({ unique: true, required: true, type: Types.UUID })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true, type: Number })
  stock: number;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'order_item', default: [] }],
    default: [],
  })
  orderItems: OdmOrderItemEntity[];

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;

  static create(
    id: string,
    name: string,
    description: string,
    price: number,
    stock: number,
  ): OdmProductEntity {
    const product = new OdmProductEntity();
    product.id = id;
    product.name = name;
    product.description = description;
    product.price = price;
    product.stock = stock;
    return product;
  }
}

export const OdmProductEntitySchema =
  SchemaFactory.createForClass(OdmProductEntity);

OdmProductEntitySchema.pre('deleteOne', async function (next) {
  const productId = this.getFilter().id;

  // Verificar si el ID existe
  if (!productId) {
    console.error('No productId found in query filter');
    return next(new Error('Product ID not provided'));
  }

  try {
    // Eliminar los OrderItems relacionados
    const result = await this.model.db.model('order_item').deleteMany({
      productId: productId,
    });

    next();
  } catch (error) {
    next(error);
  }
});

export const OdmProductEntityModel: ModelDefinition = {
  name: 'product',
  schema: OdmProductEntitySchema,
};
