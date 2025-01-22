const Order = require("../models/order.schema");

exports.createOrder = async (req, res) => {
    try {
      const { customer_id, coupon_id, coupon_amount, tax, sub_amount, total_amount, payment_method, products } = req.body;
  
      const order = new Order({
        customer_id,
        coupon_id,
        coupon_amount,
        tax,
        sub_amount,
        total_amount,
        payment_method,
        products,
        admin_id: req.userId,
      });
  
      const savedOrder = await order.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create order', details: error.message });
    }
  };
  

  exports.getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find()
        .populate('customer_id', 'name email') 
        .populate('products.product_id', 'name price'); 
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
    }
  };
  

  exports.filterOrdersByDate = async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
      const orders = await Order.find({
        created_at: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      })
        .populate('customer_id', 'name email')
        .populate('products.product_id', 'name price');
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to filter orders', details: error.message });
    }
  };
  

  exports.searchOrdersByCustomerName = async (req, res) => {
    const { customerName } = req.query;
    try {
      const customers = await Customer.find({
        name: { $regex: customerName, $options: 'i' }, // Case-insensitive regex
      });
      const customerIds = customers.map(customer => customer._id);
  
      const orders = await Order.find({ customer_id: { $in: customerIds } })
        .populate('customer_id', 'name email')
        .populate('products.product_id', 'name price');
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to search orders', details: error.message });
    }
  };
  

  exports.updateOrder = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { ...updatedData, updated_at: Date.now() },
        { new: true } // Return the updated document
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order', details: error.message });
    }
  };
  

  exports.deleteOrder = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedOrder = await Order.findByIdAndDelete(id);
  
      if (!deletedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete order', details: error.message });
    }
  };
  