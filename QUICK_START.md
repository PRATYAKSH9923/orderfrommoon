# Quick Start Checklist

Follow this checklist to get from zero to live in production!

## Phase 1: Local Development Setup (30 minutes)

- [ ] Clone repository to local machine
- [ ] Run `npm install`
- [ ] Create Supabase project (if not done)
- [ ] Copy `.env.example` to `.env.local`
- [ ] Add Supabase credentials to `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Add admin credentials (change from defaults):
  - `NEXT_PUBLIC_ADMIN_USERNAME`
  - `NEXT_PUBLIC_ADMIN_PASSWORD`
- [ ] Run `npm run dev`
- [ ] Visit http://localhost:3000

## Phase 2: Database Setup (20 minutes)

- [ ] In Supabase, go to SQL Editor
- [ ] Copy and run [DATABASE_SCHEMA.sql](./DATABASE_SCHEMA.sql)
- [ ] Verify tables created:
  - `restaurant_settings`
  - `categories`
  - `menu_items`
  - `orders`
  - `order_items`
- [ ] Run [SAMPLE_MENU_ITEMS.sql](./SAMPLE_MENU_ITEMS.sql) to add sample items
- [ ] Update `restaurant_settings` with your info:
  - Restaurant name
  - Colors (primary & secondary)
  - WhatsApp number

## Phase 3: Enable Real-time (5 minutes)

In Supabase Dashboard:
- [ ] Go to **Realtime**
- [ ] Enable for `orders` table
- [ ] Enable for `order_items` table
- [ ] Enable for `restaurant_settings` table

## Phase 4: Test Locally (15 minutes)

### Consumer Testing
- [ ] Visit `/consumer`
- [ ] Browse menu by category
- [ ] Search for items
- [ ] Add items to cart
- [ ] Verify cart updates
- [ ] Checkout with test info
- [ ] Verify order created in Supabase
- [ ] Check WhatsApp countdown (10 seconds)
- [ ] Verify WhatsApp opens after countdown
- [ ] Track order on `/order/[number]` page

### Admin Testing
- [ ] Visit `/admin`
- [ ] Login with test credentials
- [ ] See new orders notification
- [ ] Change order status
- [ ] Verify consumer sees update in real-time
- [ ] Test search by order number
- [ ] Check completed orders tab

### PWA Testing
- [ ] Open Chrome DevTools (F12)
- [ ] Go to **Application** tab
- [ ] Check **Manifest** loads
- [ ] Check **Service Worker** registered
- [ ] Check **Cache Storage** populated
- [ ] Test install: Menu → "Install app"

## Phase 5: Deploy to Production (30 minutes)

### GitHub Setup
- [ ] Initialize git: `git init`
- [ ] Add remote: `git remote add origin <your-repo>`
- [ ] Commit all: `git add . && git commit -m "Initial commit"`
- [ ] Push: `git push -u origin main`

### Vercel Deployment
- [ ] Go to https://vercel.com
- [ ] Sign in with GitHub
- [ ] Click "New Project"
- [ ] Import your repository
- [ ] Add environment variables:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `NEXT_PUBLIC_ADMIN_USERNAME`
  - [ ] `NEXT_PUBLIC_ADMIN_PASSWORD`
- [ ] Click "Deploy"
- [ ] Wait for build to complete (2-5 min)
- [ ] Copy deployment URL

### Supabase CORS Configuration
- [ ] Go to Supabase Settings → API
- [ ] Find CORS configuration
- [ ] Add your Vercel URL:
  - [ ] `https://your-project.vercel.app`
  - [ ] `https://*.vercel.app`

### Final Verification
- [ ] Visit your deployed URL
- [ ] Test consumer flow end-to-end
- [ ] Test admin login
- [ ] Verify real-time updates work
- [ ] Test on real Android device
- [ ] Install as PWA on Android
- [ ] Test offline functionality

## Phase 6: Post-Launch (ongoing)

- [ ] Monitor Vercel analytics
- [ ] Monitor Supabase dashboard
- [ ] Add more menu items as needed
- [ ] Collect customer feedback
- [ ] Update restaurant colors/branding
- [ ] Plan enhancements

## Time Estimates

| Phase | Time | Status |
|-------|------|--------|
| 1. Local Setup | 30 min | |
| 2. Database Setup | 20 min | |
| 3. Enable Real-time | 5 min | |
| 4. Test Locally | 15 min | |
| 5. Deploy to Production | 30 min | |
| 6. Post-Launch | Ongoing | |
| **Total** | **~2 hours** | |

## Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Service Worker not loading | Check browser console, clear site data, reload |
| Realtime not working | Enable in Supabase → Realtime, check console |
| WhatsApp link not opening | Verify phone number format (with country code) |
| Admin login not working | Check env variables, verify credentials |
| Database connection error | Check Supabase URL and keys in `.env.local` |
| Build fails on Vercel | Check build logs, verify all env vars set |

## Success Metrics

Your app is ready when:

- ✅ Consumer can place order
- ✅ Admin receives order in real-time
- ✅ Admin can update status
- ✅ Consumer sees status updates in real-time
- ✅ WhatsApp confirmation works
- ✅ App is installable on Android
- ✅ App works offline (PWA)
- ✅ Deployed on Vercel and working

## Get Help

1. **Setup Issues**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. **Database Issues**: See [DATABASE_SCHEMA.sql](./DATABASE_SCHEMA.sql)
3. **Deployment Issues**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
4. **Architecture Questions**: See [ARCHITECTURE.md](./ARCHITECTURE.md)

## Next Steps

After launch:
1. Customize branding (colors, logo)
2. Add all menu items
3. Test with real Android devices
4. Gather feedback
5. Plan phase 2 features
6. Monitor performance
7. Optimize based on usage patterns

---

**Ready? Start with [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)! 🚀**
