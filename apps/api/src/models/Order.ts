import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  type: 'course' | 'subscription' | 'bundle';
  itemId: mongoose.Types.ObjectId;
  title: string;
  price: number;
  discount: number;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  orderNumber: string;
  items: IOrderItem[];
  pricing: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    currency: string;
  };
  coupon?: {
    code: string;
    discountAmount: number;
  };
  payment: {
    provider: 'stripe';
    stripePaymentIntentId?: string;
    stripeChargeId?: string;
    status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';
    paidAt?: Date;
  };
  billing: {
    name: string;
    email: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  };
  invoice?: {
    number?: string;
    url?: string;
  };
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    type: {
      type: String,
      enum: ['course', 'subscription', 'bundle'],
      required: true,
    },
    itemId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    items: [orderItemSchema],
    pricing: {
      subtotal: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      total: { type: Number, required: true },
      currency: { type: String, default: 'USD' },
    },
    coupon: {
      code: String,
      discountAmount: Number,
    },
    payment: {
      provider: {
        type: String,
        enum: ['stripe'],
        default: 'stripe',
      },
      stripePaymentIntentId: String,
      stripeChargeId: String,
      status: {
        type: String,
        enum: ['pending', 'processing', 'succeeded', 'failed', 'refunded'],
        default: 'pending',
      },
      paidAt: Date,
    },
    billing: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
      },
    },
    invoice: {
      number: String,
      url: String,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled', 'refunded'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes (orderNumber index created by unique: true in schema)
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ 'payment.stripePaymentIntentId': 1 });
orderSchema.index({ status: 1 });

// Generate order number
orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

export const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
