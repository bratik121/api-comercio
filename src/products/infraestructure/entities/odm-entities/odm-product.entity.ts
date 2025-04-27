import { Prop, Schema, SchemaFactory, ModelDefinition } from '@nestjs/mongoose';
import { Types } from 'mongoose';

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

export const OdmProductEntityModel: ModelDefinition = {
  name: 'product',
  schema: OdmProductEntitySchema,
};
