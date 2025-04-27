import { Prop, Schema, SchemaFactory, ModelDefinition } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'user', timestamps: true })
export class OdmUserEntity {
  @Prop({ unique: true, required: true, type: Types.UUID })
  id: string;

  @Prop()
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  password: string;

  id_status: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;

  static create(
    id: string,
    name: string,
    email: string,
    password: string,
  ): OdmUserEntity {
    const user = new OdmUserEntity();
    user.id = id;
    user.name = name;
    user.email = email;
    user.password = password;
    return user;
  }
}

export const OdmUserEntitySchema = SchemaFactory.createForClass(OdmUserEntity);

export const OdmUserEntityModel: ModelDefinition = {
  name: 'user',
  schema: OdmUserEntitySchema,
};
