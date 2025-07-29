import mongoose, { Schema, Document } from "mongoose";

export interface OrderItem {
  book: mongoose.Types.ObjectId;
  quantity: number;
  price: number; // Price at time of purchase
}

export interface OrderDocument extends Document {
  user: mongoose.Types.ObjectId;
  orderNumber: string;
  items: OrderItem[];
  contactDetails: {
    phone: string;
    email: string;
    name: string;
  };
  shippingAddress: string;
  txnId: string;
  isGuestOrder: boolean;
  status: string;
  paymentStatus: string;
  amount: number;
  fulfillment: {
    trackingNumber?: string;
    shippingProvider?: string;
    trackingUrl?: string;
    shippedAt?: Date;
    deliveredAt?: Date;
    estimatedDelivery?: Date;
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    txnId: {
      type: String,
      unique: true,
      required: true,
    },
    items: [
      {
        book: {
          type: Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    contactDetails: {
      phone: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    shippingAddress: {
      type: {
        addressLine1: {
          type: String,
          required: true,
          trim: true,
          maxLength: 100,
        },
        addressLine2: {
          type: String,
          trim: true,
          maxLength: 100,
        },
        landmark: {
          type: String,
          trim: true,
          maxLength: 100,
        },
        city: {
          type: String,
          required: true,
          trim: true,
        },
        state: {
          type: String,
          required: true,
          enum: [
            "Andhra Pradesh",
            "Arunachal Pradesh",
            "Assam",
            "Bihar",
            "Chhattisgarh",
            "Goa",
            "Gujarat",
            "Haryana",
            "Himachal Pradesh",
            "Jharkhand",
            "Karnataka",
            "Kerala",
            "Madhya Pradesh",
            "Maharashtra",
            "Manipur",
            "Meghalaya",
            "Mizoram",
            "Nagaland",
            "Odisha",
            "Punjab",
            "Rajasthan",
            "Sikkim",
            "Tamil Nadu",
            "Telangana",
            "Tripura",
            "Uttar Pradesh",
            "Uttarakhand",
            "West Bengal",
            "Andaman and Nicobar Islands",
            "Chandigarh",
            "Daman and Diu",
            "Delhi",
            "Jammu and Kashmir",
            "Ladakh",
            "Lakshadweep",
            "Puducherry",
          ],
        },
        pincode: {
          type: String,
          required: true,
          match: /^[1-9][0-9]{5}$/, // Indian PIN code format
          trim: true,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
        addressType: {
          type: String,
          required: true,
          enum: ["Home", "Work", "Other"],
          default: "Home",
        },
      },
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    isGuestOrder: {
      type: Boolean,
      required: true,
      default: false,
    },
    fulfillment: {
      trackingNumber: {
        type: String,
        trim: true,
      },
      shippingProvider: {
        type: String,
        enum: [
          "FedEx",
          "DHL",
          "UPS",
          "Blue Dart",
          "DTDC",
          "India Post",
          "Delhivery",
          "Ecom Express",
          "Other",
        ],
        trim: true,
      },
      trackingUrl: {
        type: String,
        trim: true,
      },
      shippedAt: {
        type: Date,
      },
      deliveredAt: {
        type: Date,
      },
      estimatedDelivery: {
        type: Date,
      },
      notes: {
        type: String,
        trim: true,
        maxLength: 500,
      },
    },
  },
  { timestamps: true }
);

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ORD${Date.now()}-${count + 1}`;
  }
  next();
});

export const Order = mongoose.model<OrderDocument>("Order", orderSchema);
