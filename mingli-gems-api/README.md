# MingLi Gems API

Backend API for MingLi Gems order management system.

## Features

- Order creation and management
- Payment status tracking
- Shipping/tracking integration
- Admin dashboard API
- CSV export functionality

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/orders` | Create new order |
| GET | `/api/orders/:orderId` | Get order by ID |
| GET | `/api/orders/email/:email` | Get orders by email |
| PATCH | `/api/orders/:orderId/payment` | Update payment status |

### Admin Endpoints (requires API key)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/orders` | Get all orders |
| PATCH | `/api/admin/orders/:orderId` | Update order |
| PATCH | `/api/admin/orders/:orderId/tracking` | Add tracking number |
| DELETE | `/api/admin/orders/:orderId` | Delete order |
| GET | `/api/admin/orders/export` | Export to CSV |

## Deployment to Vercel

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Set Environment Variables

```bash
vercel env add MONGODB_URI
# Enter your MongoDB connection string

vercel env add ADMIN_API_KEY
# Enter a secure random string for admin access
```

### 4. Deploy

```bash
vercel --prod
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `ADMIN_API_KEY` | Secret key for admin endpoints |
| `PORT` | Port for local development (default: 3000) |

## Local Development

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Run development server
npm run dev
```

## Order Schema

```javascript
{
  orderId: String,           // MLG + YYMMDD + 4 random chars
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
  items: [{
    name: String,
    price: Number,
    quantity: Number,
    details: String
  }],
  subtotal: Number,
  shipping: Number,
  total: Number,
  paymentMethod: String,     // paypal | bank_transfer | lianlian
  paymentStatus: String,     // pending | paid | failed | refunded
  orderStatus: String,       // Pending | Paid | Processing | Shipped | Delivered | Cancelled
  trackingNumber: String,
  shippingCarrier: String,   // UPS | FedEx | DHL | USPS | SF | EMS
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Admin API Key Usage

Include the admin API key in the header for protected endpoints:

```
x-admin-key: your_secure_admin_key_here
```

Example:
```bash
curl -H "x-admin-key: your_key" https://your-api.vercel.app/api/admin/orders
```
