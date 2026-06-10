# README.md

# 🧇 The Belgian Waffle Xpress

**Production-Ready Mobile-First Restaurant Ordering Application**

A modern web application for restaurants to accept online orders with real-time order tracking, admin management, and PWA support.

## 🚀 Features

### Consumer App
- ✅ Browse menu by categories
- ✅ Search menu items
- ✅ Add to cart with quantity management
- ✅ Smooth animations & mobile-optimized UI
- ✅ Checkout with customer details
- ✅ WhatsApp order confirmation with countdown timer
- ✅ Real-time order tracking
- ✅ Today's order history
- ✅ Hindi & Punjabi language support
- ✅ Works offline (PWA)

### Admin Dashboard
- ✅ Secure login (username/password)
- ✅ View new orders with notification dot
- ✅ Manage order status (New → Accepted → Preparing → Done)
- ✅ Search orders by order ID
- ✅ Real-time updates push to customers
- ✅ Order history with filtering
- ✅ Touch-friendly interface for Android

### Technical Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime subscriptions
- **State**: Zustand
- **Icons**: Lucide React
- **PWA**: Service Worker, Web App Manifest
- **Mobile**: Mobile-first responsive design

## 🛠️ Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd orderfrommoon
npm install
```

### 2. Supabase Setup

Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md):
- Create Supabase project
- Get API credentials
- Create tables using DATABASE_SCHEMA.sql
- Update menu items

### 3. Configure Environment

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
SUPABASE_SERVICE_ROLE_KEY=<your-key>
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=secure_password
```

### 4. Run Development

```bash
npm run dev
```

Visit:
- 🏠 http://localhost:3000 (Landing)
- 🛒 http://localhost:3000/consumer (Menu)
- 👨‍💼 http://localhost:3000/admin (Admin)

## 📱 Mobile Testing

Install on Android:
1. Open on Android Chrome
2. Menu → "Install app" or "Add to Home Screen"
3. App works offline with PWA

## 🗄️ Database Schema

```
restaurant_settings    - Branding & config
categories            - Menu categories  
menu_items           - Food/drink items
orders               - Customer orders
order_items          - Items in each order
```

See [DATABASE_SCHEMA.sql](./DATABASE_SCHEMA.sql) for full schema.

## 📝 Key Features

### Order Management
- Auto-generated order numbers (#101, #102, etc.)
- Real-time status updates
- Customer tracking with WebSocket
- WhatsApp integration for confirmation

### Restaurant Branding
- Customizable colors
- Restaurant name & logo
- WhatsApp number for orders

### Languages
- 🇮🇳 Hindi
- 🇮🇳 Punjabi  
- 🇬🇧 English

## 📚 Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete setup instructions
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy to Vercel
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Supabase configuration
- [DATABASE_SCHEMA.sql](./DATABASE_SCHEMA.sql) - Database structure

## 🔐 Security

- ✅ Environment variables for secrets
- ✅ Row-Level Security (RLS) policies
- ✅ Admin protected by credentials
- ✅ No payment processing (reduces PCI scope)
- ✅ Service worker with cache strategy

## 📦 Deployment

Deploy to Vercel in 2 clicks:

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🤖 API Routes (Future)

- `POST /api/orders` - Create order
- `PATCH /api/orders/:id` - Update order status
- `GET /api/orders` - List orders (with filtering)

## ⚙️ Configuration

All settings in Supabase `restaurant_settings` table:

| Field | Default | Purpose |
|-------|---------|---------|
| name | The Belgian Waffle Xpress | Restaurant name |
| primary_color | #F59E0B | Button & header color |
| secondary_color | #3B82F6 | Accent color |
| whatsapp_number | 919876543210 | Order confirmations |

## 🎨 UI/UX Design

- Mobile-first approach
- Touch-friendly buttons (min 44px)
- One-hand operation optimized
- Fast animations
- Clear visual feedback
- Hindi/Punjabi labels

## 📊 Real-time Features

- Admin notifications for new orders
- Customer sees order status instantly
- No page refresh needed
- Uses Supabase Realtime WebSockets

## 🧪 Testing

Manual testing checklist included in SETUP_GUIDE.md.

No automated tests included yet - add Jest/Playwright as needed.

## 🚀 Performance

- Optimized images
- Code splitting
- PWA caching
- Minified CSS/JS
- CDN delivery via Vercel

## 📱 PWA Features

- Installable on Android
- Offline fallback page
- Service worker caching
- Web App Manifest
- Fast load times

## 🔄 Updates

To update from main branch:

```bash
git pull origin main
npm install
npm run dev
```

## 📞 Support

For issues:
1. Check browser console
2. Review SETUP_GUIDE.md troubleshooting
3. Check Supabase logs
4. Verify environment variables

## 📄 License

[Your License Here]

## 👨‍💻 Credits

Built with:
- Next.js 15
- Supabase
- Tailwind CSS
- Zustand
- Lucide Icons

---

**Ready to launch?** Start with [SETUP_GUIDE.md](./SETUP_GUIDE.md)! 🚀
