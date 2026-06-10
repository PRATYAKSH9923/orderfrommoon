# Project Architecture

## Directory Structure

```
orderfrommoon/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with PWA support
│   ├── page.tsx                 # Landing page (two entry points)
│   ├── globals.css              # Global styles
│   ├── consumer/
│   │   └── page.tsx             # Consumer menu & shopping
│   ├── admin/
│   │   ├── page.tsx             # Admin login
│   │   └── dashboard/
│   │       └── page.tsx         # Admin dashboard
│   └── order/
│       └── [orderNumber]/
│           └── page.tsx         # Order tracking page
│
├── src/
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client
│   │   └── constants.ts         # Constants & labels (Hindi/Punjabi)
│   ├── store/
│   │   ├── cartStore.ts         # Zustand cart store
│   │   ├── adminStore.ts        # Admin auth store
│   │   └── restaurantStore.ts   # Restaurant settings store
│   └── components/
│       ├── PWAInstaller.tsx     # Service worker registration
│       ├── ui/                  # Reusable UI components
│       │   ├── Button.tsx
│       │   ├── Card.tsx
│       │   ├── Input.tsx
│       │   ├── Modal.tsx
│       │   ├── Toast.tsx
│       │   └── MenuItemCard.tsx
│       ├── consumer/            # Consumer-specific components
│       │   ├── ConsumerHeader.tsx
│       │   ├── CartSummary.tsx
│       │   ├── CheckoutModal.tsx
│       │   ├── OrderConfirmationModal.tsx
│       │   └── OrderStatusTracker.tsx
│       └── admin/               # Admin-specific components
│           ├── AdminHeader.tsx
│           └── AdminOrderCard.tsx
│
├── public/                      # Static assets
│   ├── manifest.json           # PWA manifest
│   ├── service-worker.js       # Service worker
│   ├── offline.html            # Offline fallback
│   ├── icon-*.png              # App icons
│   └── screenshot-*.png        # PWA screenshots
│
├── DATABASE_SCHEMA.sql         # PostgreSQL schema
├── SAMPLE_MENU_ITEMS.sql       # Sample data
├── SUPABASE_SETUP.md           # Supabase configuration
├── SETUP_GUIDE.md              # Development setup
├── DEPLOYMENT.md               # Vercel deployment
├── README_MAIN.md              # Main readme
└── package.json                # Dependencies
```

## Data Flow

### Consumer Flow
```
Landing Page
    ↓
Consumer App (Browse Menu)
    ↓
Add Items to Cart (Zustand)
    ↓
Checkout Modal
    ↓
Create Order (Supabase)
    ↓
Order Confirmation Modal (WhatsApp Countdown)
    ↓
Order Tracking Page (Real-time via Supabase Realtime)
```

### Admin Flow
```
Admin Login
    ↓
Dashboard (Real-time order list)
    ↓
Update Order Status (NEW → ACCEPTED → PREPARING → DONE)
    ↓
Customer sees updates in real-time
```

### Real-time Update Flow
```
Admin Updates Order Status
    ↓
Supabase Database Updated
    ↓
Realtime Event Broadcast
    ↓
Customer's Tracking Page Receives Update
    ↓
UI Updates Without Refresh
```

## State Management

### Zustand Stores

#### 1. Cart Store (`cartStore.ts`)
```typescript
- items: CartItem[]
- addItem(item: MenuItem)
- removeItem(itemId: string)
- updateQuantity(itemId: string, quantity: number)
- clearCart()
- getTotalItems(): number
- getTotalPrice(): number
```

#### 2. Admin Store (`adminStore.ts`)
```typescript
- isAuthenticated: boolean
- newOrdersCount: number
- login()
- logout()
- setNewOrdersCount(count: number)
```

#### 3. Restaurant Store (`restaurantStore.ts`)
```typescript
- settings: RestaurantSettings | null
- loading: boolean
- error: string | null
- setSettings(settings: RestaurantSettings)
- getPrimaryColor(): string
- getSecondaryColor(): string
```

## Database Schema

### Tables

1. **restaurant_settings**
   - id (UUID, PK)
   - name, logo_url
   - primary_color, secondary_color
   - whatsapp_number
   - timestamps

2. **categories**
   - id (UUID, PK)
   - name, display_order
   - timestamp

3. **menu_items**
   - id (UUID, PK)
   - category_id (FK)
   - name, description, price
   - display_order
   - timestamp

4. **orders**
   - id (UUID, PK)
   - display_order_number (auto-generated: #101, #102...)
   - customer_name, customer_phone
   - status (NEW, ACCEPTED, PREPARING, DONE)
   - total_amount
   - timestamps (created_at, updated_at)

5. **order_items**
   - id (UUID, PK)
   - order_id, menu_item_id (FKs)
   - name, price, quantity
   - timestamp

## Authentication

### Consumer
- No authentication required
- Public read access to menu
- Anyone can place order

### Admin
- Username + Password authentication
- Stored in `.env.local` (environment variables)
- No database auth yet (simple version)

Future: Consider JWT or Supabase Auth

## Real-time Subscriptions

### Consumer Order Tracking
```typescript
supabase
  .channel(`order-${orderNumber}`)
  .on('postgres_changes', 
    { event: 'UPDATE', table: 'orders' },
    (payload) => {
      // Update UI with new status
    }
  )
  .subscribe()
```

### Admin Order List
```typescript
supabase
  .channel('orders')
  .on('postgres_changes',
    { event: '*', table: 'orders' },
    (payload) => {
      // Update order list with NEW/UPDATE/DELETE
    }
  )
  .subscribe()
```

## Component Hierarchy

```
RootLayout (PWA Setup)
├── Home (Landing)
│   ├── ConsumerHeader
│   ├── ConsumerApp
│   │   ├── MenuItemCard
│   │   └── CartSummary
│   ├── CheckoutModal
│   └── OrderConfirmationModal
├── AdminLogin
├── AdminDashboard
│   ├── AdminHeader
│   └── AdminOrderCard[]
└── OrderTrackingPage
    ├── OrderStatusTracker
    └── Order Details
```

## Key APIs

### Supabase Endpoints

**Orders**
- `POST /rest/v1/orders` - Create order
- `GET /rest/v1/orders` - List orders
- `PATCH /rest/v1/orders` - Update order

**Menu**
- `GET /rest/v1/menu_items` - Get items
- `GET /rest/v1/categories` - Get categories

**Settings**
- `GET /rest/v1/restaurant_settings` - Get restaurant data

## Performance Optimizations

1. **Code Splitting**: Dynamic imports for modals
2. **Image Optimization**: Next.js Image component
3. **Service Worker**: Network-first caching strategy
4. **Compression**: Gzip/Brotli via Vercel
5. **Bundle Size**: Tree-shaking, minification

## Security Measures

1. **Environment Variables**: Secrets not in code
2. **CORS**: Configured in Supabase
3. **RLS**: Row-level security on tables
4. **Rate Limiting**: Via Supabase
5. **Input Validation**: TypeScript + Zod (future)

## Internationalization

Current: Hindi & Punjabi hard-coded
Future: i18next for scalability

## PWA Features

1. **Manifest**: Web app metadata
2. **Service Worker**: Offline support
3. **Icons**: Multiple sizes
4. **Installability**: Add to home screen
5. **Responsiveness**: Mobile-first design

## Deployment Architecture

```
GitHub Repository
    ↓
Vercel CI/CD
    ↓
Build & Deploy
    ↓
Supabase Database
    ↓
CDN (Vercel)
    ↓
Client (Browser/PWA)
```

## Monitoring & Debugging

### Development
- Browser DevTools
- Vercel Preview Deployments
- Supabase Dashboard

### Production
- Vercel Analytics
- Supabase Logs
- Error Tracking (Sentry recommended)

## Future Enhancements

1. **Payment Integration**: Stripe/Razorpay
2. **Analytics**: Mixpanel/Amplitude
3. **Email Notifications**: SendGrid
4. **SMS Notifications**: Twilio
5. **Inventory Management**: Track stock
6. **Staff Accounts**: Multiple admin users
7. **Reports**: Sales, popular items
8. **Multi-restaurant**: Franchise support
9. **Ratings & Reviews**: Customer feedback
10. **Loyalty Program**: Points/rewards

## Performance Targets

- Page Load: < 2s
- First Contentful Paint: < 1s
- Lighthouse Score: > 90
- Mobile Friendly: 100%
- PWA Score: 100%

## Troubleshooting Guide

See SETUP_GUIDE.md for detailed troubleshooting.

Common issues:
1. Service Worker not loading
2. Realtime subscriptions not working
3. CORS errors
4. Environment variables not set
5. Database connection issues
