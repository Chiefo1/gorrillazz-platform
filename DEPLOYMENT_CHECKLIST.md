# Gorrillazz Platform Deployment Checklist

## Pre-Deployment Steps

### 1. Database Setup
- [ ] Run Prisma migrations: `npx prisma migrate deploy`
- [ ] Generate Prisma client: `npx prisma generate`
- [ ] Run database initialization script: `psql $DATABASE_URL -f scripts/init-database.sql`
- [ ] Verify all tables exist: User, Token, Transaction, LiquidityPool, GorrPrice

### 2. Environment Variables
Ensure all required environment variables are set in Vercel:

**Database:**
- [ ] `DATABASE_URL` - Neon PostgreSQL connection string

**Admin Configuration:**
- [ ] `ADMIN_USERNAME` - Admin login username
- [ ] `ADMIN_PASSWORD` - Admin login password (hashed)
- [ ] `ADMIN_WALLET_ADDRESS` - Admin wallet address (default: gorr_admin_wallet_2024)

**Gorrillazz Network:**
- [ ] `GORRILLAZZ_RPC_URL` - RPC endpoint for Gorrillazz network
- [ ] `GORRILLAZZ_CHAIN_ID` - Chain ID (default: 9999)
- [ ] `GORRILLAZZ_PRIVATE_KEY` - Private key for blockchain operations
- [ ] `GORR_CONTRACT_ADDRESS_GORRILLAZZ` - GORR token contract address
- [ ] `USDCC_CONTRACT_ADDRESS_GORRILLAZZ` - USDCc token contract address

**Payment Providers:**
- [ ] `REVOLUT_API_KEY` - Revolut API key
- [ ] `REVOLUT_MERCHANT_ID` - Revolut merchant ID
- [ ] `PAYPAL_CLIENT_ID` - PayPal client ID
- [ ] `PAYPAL_CLIENT_SECRET` - PayPal client secret
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key
- [ ] `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

**Application:**
- [ ] `NEXT_PUBLIC_APP_URL` - Application URL (https://gorrillaz.app)

### 3. Build Configuration
- [ ] Verify `package.json` build script includes `prisma generate`
- [ ] Check ESLint configuration is present
- [ ] Ensure all TypeScript errors are resolved

### 4. Common Issues & Fixes

#### Issue: "prisma.Transaction does not exist"
**Solution:**
\`\`\`bash
npx prisma generate
npm run build
\`\`\`

#### Issue: Wallet page shows only background
**Solution:**
- Check browser console for errors
- Verify `/api/tokens/index` returns data
- Ensure wallet is properly connected
- Check that GORR and USDCc tokens are in the response

#### Issue: Admin withdrawal fails
**Solution:**
- Ensure admin user exists in database
- Run: `INSERT INTO "User" ("id", "walletAddress", "username") VALUES ('admin_user_id', 'gorr_admin_wallet_2024', 'admin') ON CONFLICT DO NOTHING;`
- Verify `ADMIN_WALLET_ADDRESS` environment variable is set

#### Issue: Only Revolut shows in admin payment options
**Solution:**
- Check that all 3 payment providers are rendered in admin page
- Verify the select dropdown has options for: revolut, paypal, card
- Clear browser cache and reload

### 5. Testing Checklist
- [ ] Homepage loads correctly
- [ ] Wallet connection works
- [ ] Wallet page displays tokens (GORR, USDCc, etc.)
- [ ] Token balances load correctly
- [ ] Buy/Sell/Swap buttons work
- [ ] Send token functionality works
- [ ] Payment deposit works (Revolut, PayPal, Card)
- [ ] Payment withdrawal works (Revolut, PayPal, Card)
- [ ] Admin login works
- [ ] Admin dashboard displays all sections
- [ ] Admin wallet shows all 3 payment options
- [ ] Admin withdrawal is fee-free
- [ ] Token verification system works

### 6. Production Deployment
\`\`\`bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Run database migrations
npx prisma migrate deploy

# 4. Build application
npm run build

# 5. Start production server
npm start
\`\`\`

### 7. Post-Deployment Verification
- [ ] Visit https://gorrillaz.app
- [ ] Test wallet connection
- [ ] Verify all pages load
- [ ] Check admin dashboard
- [ ] Test payment flows
- [ ] Monitor error logs in Vercel

## Troubleshooting

### Database Connection Issues
\`\`\`bash
# Test database connection
npx prisma db pull

# Reset database (CAUTION: Deletes all data)
npx prisma migrate reset
\`\`\`

### Clear Prisma Cache
\`\`\`bash
rm -rf node_modules/.prisma
npx prisma generate
\`\`\`

### View Logs
- Vercel Dashboard → Project → Logs
- Check for `[v0]` prefixed debug messages

## Support
For issues, check:
1. Vercel deployment logs
2. Browser console errors
3. Network tab for failed API calls
4. Database connection status in Neon dashboard
\`\`\`

```typescript file="" isHidden
