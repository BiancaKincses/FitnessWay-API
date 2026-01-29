import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type OrderDocument = Order & Document

export type OrderStatus = 'pending' | 'paid' | 'cancelled'

@Schema({ timestamps: true })
export class OrderItem {
  @Prop({ required: true })
  productId: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  price: number

  @Prop({ required: true })
  qty: number
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem)

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  userId: string

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  fullName: string

  @Prop({ required: true })
  phone: string

  @Prop({ required: true })
  address: string

  @Prop({ required: true })
  paymentMethod: 'card' | 'cash'

  @Prop()
  notes?: string

  @Prop({ type: [OrderItemSchema], default: [] })
  items: OrderItem[]

  @Prop({ required: true })
  total: number

  @Prop({ default: 'pending' })
  status: OrderStatus
}


export const OrderSchema = SchemaFactory.createForClass(Order)
