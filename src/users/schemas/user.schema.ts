import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { AccessLevel } from '../enums/access-level.enum';
import { Organization } from '../../organizations/schemas/organization.schema';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, minlength: 8 })
  password: string;

  @Prop({ required: true, enum: AccessLevel, default: AccessLevel.MEMBER })
  access_level: AccessLevel;
}

export const UserSchema = SchemaFactory.createForClass(User);
