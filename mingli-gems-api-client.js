// MingLi Gems API Client
// Include this in your HTML files to connect to the backend API

const API_BASE_URL = 'https://mingli-gems-api.vercel.app'; // Backend API URL

// Create new order
async function createOrder(orderData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }
}

// Get order by ID
async function getOrder(orderId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching order:', error);
    return { success: false, error: error.message };
  }
}

// Get orders by email
async function getOrdersByEmail(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/email/${encodeURIComponent(email)}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { success: false, error: error.message };
  }
}

// Update payment status
async function updatePaymentStatus(orderId, paymentStatus, paypalOrderId = null) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payment`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentStatus, paypalOrderId })
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating payment:', error);
    return { success: false, error: error.message };
  }
}

// Admin: Get all orders
async function getAllOrders(adminKey, page = 1, status = '') {
  try {
    const url = new URL(`${API_BASE_URL}/api/admin/orders`);
    url.searchParams.append('page', page);
    if (status) url.searchParams.append('status', status);
    
    const response = await fetch(url, {
      headers: {
        'x-admin-key': adminKey
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { success: false, error: error.message };
  }
}

// Admin: Update order
async function updateOrder(orderId, updates, adminKey) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey
      },
      body: JSON.stringify(updates)
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating order:', error);
    return { success: false, error: error.message };
  }
}

// Admin: Add tracking number
async function addTracking(orderId, trackingNumber, shippingCarrier, adminKey) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/tracking`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey
      },
      body: JSON.stringify({ trackingNumber, shippingCarrier })
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding tracking:', error);
    return { success: false, error: error.message };
  }
}

// Admin: Export orders to CSV
async function exportOrdersCSV(adminKey) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/export`, {
      headers: {
        'x-admin-key': adminKey
      }
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error exporting orders:', error);
  }
}

// Sync local orders to cloud (call this when backend is ready)
async function syncLocalOrdersToCloud() {
  const localOrders = JSON.parse(localStorage.getItem('mingli_orders') || '[]');
  
  if (localOrders.length === 0) {
    console.log('No local orders to sync');
    return;
  }
  
  console.log(`Syncing ${localOrders.length} local orders to cloud...`);
  
  for (const order of localOrders) {
    try {
      const result = await createOrder(order);
      if (result.success) {
        console.log(`Order ${order.orderId} synced successfully`);
      } else {
        console.error(`Failed to sync order ${order.orderId}:`, result.error);
      }
    } catch (error) {
      console.error(`Error syncing order ${order.orderId}:`, error);
    }
  }
  
  // Clear local orders after sync
  localStorage.removeItem('mingli_orders');
  console.log('Local orders synced and cleared');
}

// Example usage for checkout flow
async function saveOrderToBackend(orderData) {
  // First try to save to backend
  const result = await createOrder(orderData);
  
  if (result.success) {
    // Save to localStorage as backup
    let localOrders = JSON.parse(localStorage.getItem('mingli_orders') || '[]');
    localOrders.push(orderData);
    localStorage.setItem('mingli_orders', JSON.stringify(localOrders));
    
    return { success: true, orderId: result.orderId };
  } else {
    // Backend failed, save to localStorage only
    let localOrders = JSON.parse(localStorage.getItem('mingli_orders') || '[]');
    localOrders.push(orderData);
    localStorage.setItem('mingli_orders', JSON.stringify(localOrders));
    
    console.warn('Backend save failed, order saved locally only');
    return { success: true, orderId: orderData.orderId, localOnly: true };
  }
}
