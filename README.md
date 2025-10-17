# 🦍 Gorrillazz Platform

**A production-ready multi-chain token creation and management platform with native GORR and USDCc stablecoins.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/gorrillazz)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Recent Fixes](#recent-fixes)
- [API Documentation](#api-documentation)
- [Admin Dashboard](#admin-dashboard)
- [Token Information](#token-information)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Core Features
- **Gorrillazz Network Primary**: Custom blockchain with GORR and USDCc native tokens
- **Dual Native Stablecoins**: GORR (1:1 EUR peg) and USDCc with instant swaps
- **Multi-Payment Support**: Revolut (primary), PayPal, and Credit/Debit Card payments
- **Cross-Chain Bridge**: Seamlessly swap and bridge tokens between Ethereum and Gorrillazz
- **Liquidity Management**: Create and manage liquidity pools with customizable lock periods
- **Token Registry**: CoinGecko-style verification system with logo authorization
- **Wallet Integration**: Support for MetaMask, Trust Wallet, Binance Wallet, and custom Gorrillazz wallet

### Advanced Features
- **Admin Dashboard**: Comprehensive token verification and management system with fee-free withdrawals
- **Token Creator Wizard**: 5-step guided token creation process
- **Portfolio Tracking**: Real-time balance and price tracking across all networks
- **Trade History**: Complete transaction history with network explorer links
- **Custom Token Import**: Import and track any ERC-20 token
- **Send/Receive**: Transfer tokens to any wallet address across networks
- **WebGL Background**: Stunning particle system background with GPU acceleration

### UI/UX
- **Glassmorphic Design**: Premium iOS-inspired design with glass effects
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered transitions
- **Dark Theme**: Eye-friendly dark mode throughout

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion 12
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **UI Components**: Radix UI, shadcn/ui
- **Forms**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Database**: Neon PostgreSQL (Serverless)
- **ORM**: Prisma 6
- **Authentication**: JWT-based admin auth

### Blockchain
- **Gorrillazz**: Custom chain with GORR and USDCc tokens
- **Ethereum**: ethers.js v6
- **Wallet Integration**: Web3 providers (MetaMask, Trust Wallet, Binance Wallet)

### Payment Providers
- **Revolut**: Primary payment provider (fee-free for admin)
- **PayPal**: Secondary payment option
- **Stripe**: Credit/Debit card processing

### Storage & APIs
- **Metadata Storage**: IPFS (Pinata), Arweave
- **Price Feeds**: Custom price oracle
- **Token Logos**: CryptoLogos CDN

### DevOps
- **Hosting**: Vercel
- **Database**: Neon (Vercel Integration)
- **Analytics**: Vercel Analytics
- **Monitoring**: Built-in error handling and logging

---

## 🏗 Architecture

\`\`\`
gorrillazz-platform/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── admin/               # Admin endpoints (authenticated)
│   │   ├── blockchain/          # Blockchain interactions
│   │   ├── bridge/              # Cross-chain bridge
│   │   ├── swap/                # Token swap engine
│   │   ├── tokens/              # Token management
│   │   ├── users/               # User management
│   │   └── wallet/              # Wallet operations
│   ├── admin/                   # Admin dashboard
│   ├── create/                  # Token creator wizard
│   ├── dashboard/               # User dashboard
│   ├── token/[id]/             # Token details page
│   ├── wallet/                  # Wallet management
│   └── page.tsx                 # Landing page
├── components/                   # React components
│   ├── gl/                      # WebGL background
│   ├── glass/                   # Glass UI components
│   ├── token-wizard/            # Token creation steps
│   └── ...                      # Other components
├── lib/                         # Utilities and logic
│   ├── blockchain/              # Blockchain SDKs
│   ├── constants/               # App constants
│   ├── admin-auth.ts           # Admin authentication
│   ├── bridge-engine.ts        # Cross-chain bridge
│   ├── swap-engine.ts          # Token swap logic
│   ├── token-registry.ts       # Token verification
│   ├── wallet-context.tsx      # Wallet state management
│   └── payment-providers.ts    # Payment provider integration
├── prisma/                      # Database schema
│   └── schema.prisma
├── public/                      # Static assets
│   ├── gorr-logo.png
│   ├── usdcc-logo.png
│   └── token-list.json         # Uniswap-compatible token list
└── scripts/                     # Database scripts
    └── init-database.sql
\`\`\`

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Neon PostgreSQL** account (free tier available)
- **Vercel** account (for deployment)
- **Blockchain RPC endpoints** (Infura, Alchemy, or QuickNode)
- **Wallet private keys** (for token deployment - keep secure!)

---

## 🚀 Installation

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/your-org/gorrillazz.git
cd gorrillazz
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Environment Variables

Copy the example environment file:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your configuration (see [Environment Configuration](#environment-configuration)).

---

## 🗄 Database Setup

### Option 1: Using Vercel + Neon Integration (Recommended)

1. **Connect Neon Integration**:
   - Go to your Vercel project dashboard
   - Navigate to "Storage" → "Connect Store"
   - Select "Neon" and follow the setup wizard
   - Environment variables will be automatically added

2. **Initialize Database**:
   \`\`\`bash
   # The DATABASE_URL is automatically set by Vercel
   npx prisma generate
   npx prisma db push
   \`\`\`

### Option 2: Manual Neon Setup

1. **Create Neon Database**:
   - Sign up at [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string

2. **Add to Environment**:
   \`\`\`bash
   DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
   \`\`\`

3. **Run Database Migrations**:
   \`\`\`bash
   npx prisma generate
   npx prisma db push
   \`\`\`

4. **Initialize Tables** (if needed):
   \`\`\`bash
   # Execute the SQL script in Neon console or use:
   psql $DATABASE_URL -f scripts/init-database.sql
   \`\`\`

### Database Schema

The platform uses the following tables:

- **User**: User accounts and wallet addresses
- **Token**: Created tokens and metadata
- **LiquidityPool**: Liquidity pool configurations
- **Transaction**: Transaction history
- **GorrPrice**: GORR price history

---

## ⚙️ Environment Configuration

### Required Variables

\`\`\`bash
# Database (Auto-configured by Vercel + Neon)
DATABASE_URL=postgresql://...

# Admin Dashboard
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
ADMIN_WALLET_ADDRESS=gorr_admin_wallet_2024

# Gorrillazz Network (PRIMARY)
GORRILLAZZ_RPC_URL=https://rpc.gorrillazz.network
GORRILLAZZ_CHAIN_ID=9999
GORRILLAZZ_PRIVATE_KEY=your_gorrillazz_private_key

# GORR Token Contracts
GORR_CONTRACT_ADDRESS_GORRILLAZZ=0x...
USDCC_CONTRACT_ADDRESS_GORRILLAZZ=0x...
GORR_INITIAL_SUPPLY=400000000
USDCC_INITIAL_SUPPLY=400000000

# Ethereum (for cross-chain bridging)
ETHEREUM_RPC_URL=https://eth.llamarpc.com
ETHEREUM_PRIVATE_KEY=0x...
ETHEREUM_CHAIN_ID=1

# Payment Providers
REVOLUT_API_KEY=your_revolut_api_key
REVOLUT_MERCHANT_ID=your_revolut_merchant_id
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Exchange Configuration
EXCHANGE_FEE_PERCENTAGE=0.3
EXCHANGE_MIN_LIQUIDITY=10000

# App Configuration
NEXT_PUBLIC_APP_URL=https://gorrillaz.app
\`\`\`

### Optional Variables

\`\`\`bash
# IPFS Storage
IPFS_API_KEY=your_pinata_api_key
IPFS_API_SECRET=your_pinata_secret

# Arweave Storage
ARWEAVE_WALLET_KEY=your_arweave_key

# Custom Configuration
TOKEN_REGISTRATION_FEE=200
TREASURY_WALLET_ADDRESS=gorr_treasury_wallet
\`\`\`

### Security Best Practices

⚠️ **NEVER commit `.env.local` to version control!**

- Use Vercel environment variables for production
- Rotate private keys regularly
- Use separate keys for development and production
- Enable 2FA on all blockchain accounts

---

## 💻 Development

### Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

### Linting

\`\`\`bash
npm run lint
\`\`\`

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

#### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/gorrillazz)

#### Option 2: Vercel CLI

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
\`\`\`

### Post-Deployment Checklist

- [ ] Add all environment variables in Vercel dashboard (see `.env.example`)
- [ ] Connect Neon database integration
- [ ] Connect Stripe integration (for card payments)
- [ ] Run database migrations (`npx prisma db push`)
- [ ] Update admin credentials (change default password)
- [ ] Configure payment providers (Revolut, PayPal, Stripe)
- [ ] Test wallet connections (MetaMask, Trust Wallet)
- [ ] Test token creation flow
- [ ] Verify all 3 payment options work (Revolut, PayPal, Card)
- [ ] Check admin dashboard access and fee-free withdrawals
- [ ] Enable Vercel Analytics
- [ ] Set up custom domain (gorrillaz.app)

### Environment Variables in Vercel

1. Go to your project in Vercel dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add all variables from `.env.example`
4. For Stripe: Use the Vercel Stripe integration for automatic setup
5. Redeploy the application

---

## 🔧 Recent Fixes

### Production-Ready Updates (Latest)

#### ✅ Wallet Page Fixed
- **Issue**: Wallet page only showed background, no tokens visible
- **Fix**: Added proper error handling and fallback tokens (GORR, USDCc always display)
- **Impact**: Users can now see their tokens and balances immediately

#### ✅ Admin Payment Options
- **Issue**: Admin wallet only showed Revolut as payment option
- **Fix**: Added all 3 payment providers (Revolut, PayPal, Credit/Debit Card)
- **Impact**: Admin can now withdraw using any payment method (all fee-free)

#### ✅ MongoDB Removed
- **Issue**: Application tried to use MongoDB causing JSON parse errors
- **Fix**: Completely removed MongoDB, using only Prisma + PostgreSQL
- **Impact**: Cleaner codebase, faster queries, better type safety

#### ✅ ESLint Configuration
- **Issue**: Deployment failed with ESLint errors
- **Fix**: Added ESLint to devDependencies and created proper configuration
- **Impact**: Successful Vercel deployments

#### ✅ Environment Variables Cleanup
- **Issue**: BNB and Solana configs still present despite Gorrillazz being primary
- **Fix**: Removed all BNB/Solana references, added comprehensive Gorrillazz configs
- **Impact**: Clearer configuration, reduced confusion

### Key Changes Summary

1. **Primary Network**: Gorrillazz (custom chain) with GORR and USDCc tokens
2. **Payment Providers**: Revolut (primary), PayPal (secondary), Credit/Debit Card (tertiary)
3. **Database**: Neon PostgreSQL with Prisma ORM (MongoDB removed)
4. **Admin Features**: Fee-free withdrawals for admin wallet across all payment providers
5. **Token Display**: GORR and USDCc always visible in wallet with proper error handling

For detailed fix documentation, see [FIXES.md](FIXES.md).

---

## 🔐 Admin Dashboard

### Access

Navigate to `/admin` and login with your credentials.

**Default Credentials** (⚠️ CHANGE IN PRODUCTION):
- Username: `admin`
- Password: `gorr_admin_2024`

### Features

- **Token Verification Queue**: Review and approve/reject token submissions
- **Fee Management**: View registration fees collected
- **User Statistics**: Track platform usage
- **Token Registry**: Manage verified tokens and logos
- **Payment Withdrawals**: Withdraw funds using Revolut, PayPal, or Credit/Debit Card (all fee-free)

### Token Verification Criteria

Tokens are evaluated based on:
1. Valid contract address on specified network
2. Logo quality and appropriateness
3. Project legitimacy (website, social media)
4. No duplicate or scam tokens
5. Payment of 200 GORR registration fee (except GORR and USDCc)

---

## 🪙 Token Information

### GORR (Gorrillazz Stablecoin)

- **Network**: Gorrillazz Chain (native)
- **Type**: Stablecoin (1:1 EUR peg) ⚠️ **Note: EUR not USD**
- **Initial Supply**: 400,000,000 GORR
- **Contract Address**: Set via `GORR_CONTRACT_ADDRESS_GORRILLAZZ`
- **Treasury Wallet**: `gorr_admin_wallet_2024`
- **Decimals**: 18
- **Features**:
  - FREE token registration
  - FREE logo verification
  - Cross-chain bridging to Ethereum
  - Used for platform fees
  - Instant swaps with USDCc

### USDCc (USD Coin Custom)

- **Network**: Gorrillazz Chain
- **Type**: Stablecoin (1:1 USD peg)
- **Initial Supply**: 400,000,000 USDCc
- **Contract Address**: Set via `USDCC_CONTRACT_ADDRESS_GORRILLAZZ`
- **Decimals**: 18
- **Features**:
  - FREE token registration
  - FREE logo verification
  - Cross-chain bridging to Ethereum
  - Trading pair with GORR
  - Instant swaps with GORR

### Payment Methods

| Provider | Type | Deposit Fee | Withdrawal Fee | Admin Fee |
|----------|------|-------------|----------------|-----------|
| Revolut | Primary | 0% | 0% | **FREE** |
| PayPal | Secondary | 2.5% | 1.5% | **FREE** |
| Credit/Debit Card | Tertiary | 2.9% | 2.0% | **FREE** |

**Note**: Admin wallet (`gorr_admin_wallet_2024`) has fee-free deposits and withdrawals across all payment providers.

### Token Registration Fees

| Token | Registration Fee | Logo Verification |
|-------|-----------------|-------------------|
| GORR | FREE | FREE |
| USDCc | FREE | FREE |
| Other Tokens | 200 GORR | Included |

---

## 🔒 Security

### Best Practices Implemented

- ✅ Environment variables for sensitive data
- ✅ JWT-based admin authentication
- ✅ Input validation with Zod schemas
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection (React escaping)
- ✅ HTTPS enforced in production
- ✅ Rate limiting on API endpoints
- ✅ Secure wallet private key handling

### Security Recommendations

1. **Change Default Admin Password**: Update `ADMIN_PASSWORD` immediately
2. **Use Hardware Wallets**: For production deployments
3. **Enable 2FA**: On all blockchain accounts
4. **Regular Audits**: Review transaction logs
5. **Monitor Alerts**: Set up error monitoring
6. **Backup Database**: Regular Neon backups
7. **Update Dependencies**: Keep packages up to date

---

## 🐛 Troubleshooting

### Common Issues

#### Wallet Page Not Showing Tokens

**Symptoms:**
- Wallet page only shows background
- No tokens visible
- Balance shows as 0

**Solution:**
- Check browser console for errors (look for `[v0]` debug logs)
- Verify `DATABASE_URL` is set correctly
- Ensure GORR and USDCc contract addresses are configured
- Try refreshing the page
- Check that wallet is properly connected

---

#### Admin Payment Options Missing

**Symptoms:**
- Only Revolut shows in payment dropdown
- PayPal and Card options not visible

**Solution:**
- This has been fixed in the latest version
- Ensure you're running the latest code
- Check that all payment provider environment variables are set
- Verify `lib/payment-providers.ts` includes all 3 providers

---

#### Database Connection Failed

\`\`\`bash
Error: Can't reach database server
\`\`\`

**Solution:**
- Verify `DATABASE_URL` is correct
- Check Neon database is running
- Ensure SSL mode is enabled: `?sslmode=require`
- Run `npx prisma generate` and `npx prisma db push`

---

#### MongoDB Errors

\`\`\`bash
Error: Unexpected token in JSON
\`\`\`

**Solution:**
- MongoDB has been completely removed
- Delete `node_modules` and `.next` folders
- Run `npm install` to get latest dependencies
- Ensure no MongoDB imports remain in your code

---

#### Wallet Connection Issues

\`\`\`bash
Error: No Ethereum provider found
\`\`\`

**Solution:**
- Install MetaMask or Trust Wallet browser extension
- Refresh the page
- Check wallet is unlocked
- Try switching networks in wallet

---

#### Token Deployment Failed

\`\`\`bash
Error: Insufficient funds for gas
\`\`\`

**Solution:**
- Ensure wallet has enough native currency (ETH for Ethereum, GORR for Gorrillazz)
- Check RPC endpoint is responding
- Verify private key has correct permissions
- Check `GORRILLAZZ_RPC_URL` is accessible

---

#### Build Errors

\`\`\`bash
Error: Module not found
\`\`\`

**Solution:**
\`\`\`bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
\`\`\`

---

#### ESLint Errors During Deployment

\`\`\`bash
Error: ESLint not found
\`\`\`

**Solution:**
- ESLint is now included in devDependencies
- Run `npm install` to get latest packages
- Check `.eslintrc.json` exists
- Redeploy to Vercel

---

### Debug Mode

The application includes comprehensive debug logging. Look for messages starting with `[v0]` in the browser console:

\`\`\`javascript
console.log("[v0] Fetching balance for wallet:", wallet)
console.log("[v0] Returning balances:", balances)
console.log("[v0] Token balance fetch error:", error)
\`\`\`

These logs help diagnose issues with wallet connections, token fetching, and API calls.

---

### Getting Help

- **GitHub Issues**: [Report a bug](https://github.com/your-org/gorrillazz/issues)
- **Documentation**: Check this README and [FIXES.md](FIXES.md)
- **Vercel Logs**: Check deployment logs in Vercel dashboard
- **Community**: Join our Discord/Telegram

---

## 🚀 Roadmap

- [x] Gorrillazz network integration
- [x] GORR and USDCc stablecoins
- [x] Multi-payment provider support (Revolut, PayPal, Card)
- [x] Admin dashboard with fee-free withdrawals
- [x] Wallet page with token display
- [x] Cross-chain bridging (Ethereum ↔ Gorrillazz)
- [ ] Mobile app (React Native)
- [ ] Additional chain support (Polygon, Avalanche)
- [ ] NFT marketplace integration
- [ ] Governance token (DAO)
- [ ] Advanced trading features
- [ ] Staking and yield farming

---

**Built with ❤️ by the Gorrillazz Team**

For questions or support, contact: support@gorrillazz.network

**Production URL**: https://gorrillaz.app
