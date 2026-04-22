const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Order = require('./models/Order');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Generate Order ID
function generateOrderId() {
  const date = new Date();
  const dateStr = date.getFullYear().toString().slice(-2) + 
                  String(date.getMonth() + 1).padStart(2, '0') + 
                  String(date.getDate()).padStart(2, '0');
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MLG${dateStr}${randomStr}`;
}

// Middleware to check admin API key
function checkAdminKey(req, res, next) {
  const apiKey = req.headers['x-admin-key'];
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Create new order
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    
    // Generate unique order ID
    const orderId = generateOrderId();
    
    const order = new Order({
      orderId,
      ...orderData
    });
    
    await order.save();
    
    res.status(201).json({
      success: true,
      orderId,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
});

// Get order by ID
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
});

// Get orders by email
app.get('/api/orders/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const orders = await Order.find({ 'customer.email': email })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
});

// Get all orders (admin only)
app.get('/api/admin/orders', checkAdminKey, async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    
    const query = {};
    if (status) {
      query.orderStatus = status;
    }
    
    const skip = (page - 1) * limit;
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Order.countDocuments(query);
    
    res.json({
      success: true,
      orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
});

// Update order status (admin only)
app.patch('/api/admin/orders/:orderId', checkAdminKey, async (req, res) => {
  try {
    const { orderId } = req.params;
    const updates = req.body;
    
    const order = await Order.findOneAndUpdate(
      { orderId },
      updates,
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order'
    });
  }
});

// Update payment status (called by PayPal webhook or frontend)
app.patch('/api/orders/:orderId/payment', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus, paypalOrderId } = req.body;
    
    const order = await Order.findOneAndUpdate(
      { orderId },
      { 
        paymentStatus,
        paypalOrderId,
        orderStatus: paymentStatus === 'paid' ? 'Paid' : 'Pending'
      },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update payment status'
    });
  }
});

// Add tracking number (admin only)
app.patch('/api/admin/orders/:orderId/tracking', checkAdminKey, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trackingNumber, shippingCarrier } = req.body;
    
    const order = await Order.findOneAndUpdate(
      { orderId },
      { 
        trackingNumber,
        shippingCarrier,
        orderStatus: 'Shipped'
      },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error adding tracking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add tracking'
    });
  }
});

// Delete order (admin only)
app.delete('/api/admin/orders/:orderId', checkAdminKey, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOneAndDelete({ orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete order'
    });
  }
});

// Export orders to CSV (admin only)
app.get('/api/admin/orders/export', checkAdminKey, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    
    // CSV Header
    let csv = 'Order ID,Date,Customer Name,Email,Total,Status,Payment,Tracking Number\n';
    
    // CSV Rows
    orders.forEach(order => {
      csv += `${order.orderId},${order.createdAt.toISOString()},${order.customer.name},${order.customer.email},${order.total},${order.orderStatus},${order.paymentStatus},${order.trackingNumber || ''}\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export orders'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
