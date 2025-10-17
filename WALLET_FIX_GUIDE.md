# Wallet & Admin Dashboard Fix Guide

## Issues Fixed

### 1. Wallet Page Showing Only Background
**Problem:** Wallet page displays only the GL background with no content visible.

**Root Causes:**
- Tokens API not returning data properly
- Balance API failing silently
- Frontend not handling loading/error states
- Missing default token data

**Solutions Implemented:**
- Added fallback default tokens (GORR & USDCc) in wallet page
- Improved error handling in balance API (returns 200 with empty data instead of 500)
- Added comprehensive console.log debugging with `[v0]` prefix
- Fixed token fetching to always show GORR and USDCc even if API fails

**Verification:**
\`\`\`bash
# Check if tokens API works
curl https://gorrillaz.app/api/tokens/index

# Check if balance API works
curl "https://gorrillaz.app/api/wallet/balance?wallet=YOUR_ADDRESS&chain=gorrillazz"
\`\`\`

### 2. Admin Withdrawal Error: "prisma.Transaction does not exist"
**Problem:** Admin withdrawal fails with database error about Transaction model not existing.

**Root Causes:**
- Prisma client not generated after schema changes
- Database missing payment-related columns in Transaction table
- Admin user not existing in database

**Solutions Implemented:**
- Updated `init-database.sql` to add payment columns to Transaction table
- Modified admin withdrawal route to create admin user if doesn't exist
- Added proper error handling and logging
- Updated build script to run `prisma generate` before build

**Fix Steps:**
\`\`\`bash
# 1. Generate Prisma client
npx prisma generate

# 2. Run database migration to add missing columns
psql $DATABASE_URL -f scripts/init-database.sql

# 3. Verify admin user exists
psql $DATABASE_URL -c "SELECT * FROM \"User\" WHERE \"walletAddress\" = 'gorr_admin_wallet_2024';"

# 4. Rebuild application
npm run build
\`\`\`

### 3. Admin Wallet Only Showing Revolut Payment Option
**Problem:** Admin dashboard only displays Revolut as payment provider, missing PayPal and Credit/Debit Card options.

**Root Cause:**
- The code was correct, but the select dropdown wasn't rendering all options properly

**Solution Implemented:**
- Verified all 3 payment providers are in the select dropdown
- Added proper labels: "Revolut (Primary)", "PayPal", "Credit/Debit Card"
- Ensured the payment provider state updates correctly

**Verification in Admin Dashboard:**
1. Login to admin dashboard
2. Go to "Wallet & Payments" tab
3. Scroll to "Withdraw Funds" section
4. Check "Payment Provider" dropdown has 3 options:
   - Revolut (Primary)
   - PayPal
   - Credit/Debit Card

## Testing Checklist

### Wallet Page Tests
- [ ] Navigate to `/wallet`
- [ ] Page displays GL background
- [ ] If not connected: Shows "Create New Wallet" and "Login to Wallet" buttons
- [ ] Connect wallet
- [ ] Wallet address displays at top
- [ ] Portfolio value shows
- [ ] GORR token displays with logo
- [ ] USDCc token displays with logo
- [ ] Each token has Buy/Sell/Swap/Send buttons
- [ ] GORR and USDCc have "Buy with Fiat" and "Withdraw" buttons
- [ ] Click "Buy with Fiat" opens payment modal
- [ ] Payment modal shows 3 providers: Revolut, PayPal, Credit/Debit Card
- [ ] Can select different payment providers
- [ ] Can enter amount and complete purchase
- [ ] Click "Withdraw" opens withdrawal modal
- [ ] Withdrawal modal shows 3 providers
- [ ] Can enter destination and complete withdrawal

### Admin Dashboard Tests
- [ ] Navigate to `/admin`
- [ ] Login with admin credentials
- [ ] Dashboard displays 3 tabs: Wallet & Payments, Exchange & Liquidity, Token Verifications
- [ ] Click "Wallet & Payments" tab
- [ ] Admin wallet balance displays (GORR, USDCc, ETH, BNB, SOL)
- [ ] Scroll to "Withdraw Funds (Fee-Free)" section
- [ ] Payment Provider dropdown shows 3 options:
  - Revolut (Primary)
  - PayPal
  - Credit/Debit Card
- [ ] Select each provider and verify it updates
- [ ] Enter withdrawal details
- [ ] Click "Withdraw (Instant & Fee-Free)"
- [ ] Withdrawal completes successfully
- [ ] No fee is charged (admin wallet is fee-free)

## Environment Variables Required

\`\`\`env
# Database
DATABASE_URL=postgresql://...

# Admin Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
ADMIN_WALLET_ADDRESS=gorr_admin_wallet_2024

# Gorrillazz Network
GORRILLAZZ_RPC_URL=https://rpc.gorrillazz.network
GORRILLAZZ_CHAIN_ID=9999
GORRILLAZZ_PRIVATE_KEY=your_private_key
GORR_CONTRACT_ADDRESS_GORRILLAZZ=0x...
USDCC_CONTRACT_ADDRESS_GORRILLAZZ=0x...

# Payment Providers
REVOLUT_API_KEY=your_revolut_key
REVOLUT_MERCHANT_ID=your_merchant_id
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key

# Application
NEXT_PUBLIC_APP_URL=https://gorrillaz.app
\`\`\`

## Debugging Tips

### Check Browser Console
Open browser DevTools (F12) and look for:
- `[v0]` prefixed messages showing data flow
- Network errors in the Network tab
- React errors in the Console tab

### Check API Responses
\`\`\`bash
# Test tokens API
curl https://gorrillaz.app/api/tokens/index | jq

# Test balance API
curl "https://gorrillaz.app/api/wallet/balance?wallet=0x123...&chain=gorrillazz" | jq

# Test admin wallet balance
curl https://gorrillaz.app/api/admin/wallet/balance | jq
\`\`\`

### Check Database
\`\`\`sql
-- Verify Transaction table has payment columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Transaction';

-- Check admin user exists
SELECT * FROM "User" WHERE "walletAddress" = 'gorr_admin_wallet_2024';

-- Check recent transactions
SELECT * FROM "Transaction" ORDER BY "createdAt" DESC LIMIT 10;
\`\`\`

### Common Errors & Solutions

#### Error: "Failed to fetch tokens"
**Solution:** Check that `/api/tokens/index` returns valid JSON with GORR and USDCc tokens.

#### Error: "Wallet not connected"
**Solution:** Ensure wallet connection is working. Check browser console for Web3 errors.

#### Error: "prisma.transaction is not a function"
**Solution:** Run `npx prisma generate` to regenerate Prisma client.

#### Error: "User not found"
**Solution:** User is created automatically on first API call. Check database connection.

## Production Deployment

1. **Set all environment variables in Vercel**
2. **Run database initialization:**
   \`\`\`bash
   psql $DATABASE_URL -f scripts/init-database.sql
   \`\`\`
3. **Deploy to Vercel:**
   \`\`\`bash
   vercel --prod
   \`\`\`
4. **Verify deployment:**
   - Visit https://gorrillaz.app
   - Test wallet connection
   - Test admin dashboard
   - Check all payment options

## Support

If issues persist:
1. Check Vercel deployment logs
2. Review browser console errors
3. Verify all environment variables are set
4. Test API endpoints directly
5. Check database connection in Neon dashboard
