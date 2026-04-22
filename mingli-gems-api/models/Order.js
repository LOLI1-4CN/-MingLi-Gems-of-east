const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  details: String
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  items: [orderItemSchema],
  subtotal: Number,
  shipping: Number,
  total: Number,
  currency: {
    type: String,
    default: 'USD'
  },
  paymentMethod: {
    type: String,
    enum: ['paypal', 'bank_transfer', 'lianlian'],
    default: 'paypal'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paypalOrderId: String,
  trackingNumber: String,
  shippingCarrier: {
    type: String,
    enum: ['', 'UPS', 'FedEx', 'DHL', 'USPS', 'SF', 'EMS']
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  notes: String,
  baziData: {
    birthYear: Number,
    birthMonth: Number,
    birthDay: Number,
    birthHour: Number,
    birthMinute: Number,
    birthPlace: String,
    gender: String
  }
}, {
  timestamps: true
});

// Index for faster queries
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'customer.email': 1 });

module.exports = mongoose.model('Order', orderSchema);
