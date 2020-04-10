import { Document, Schema, Model, model } from 'mongoose'

export interface IDiscount extends Document {
  type: string
  value: number
  userEmail: string
}

export const DiscountSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ['percent', 'absolute'],
    require: true,
  },
  value: {
    type: Number,
    require: true,
  },
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
  }
})

const DiscountDao: Model<IDiscount> = model<IDiscount>('discounts', DiscountSchema)

export default DiscountDao
