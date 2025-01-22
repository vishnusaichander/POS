const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  coupon_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  coupon_amount: { type: String, default: '0' },
  tax: { type: String, required: true },
  sub_amount: { type: Number, required: true },
  total_amount: { type: Number, required: true },
  payment_method: { type: String, enum: ['Cash', 'Card', 'UPI', 'Online'], required: true },
  products: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
});

module.exports = mongoose.model('Order', OrderSchema);
