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
- [API Documentation](#api-documentation)
- [Admin Dashboard](#admin-dashboard)
- [Token Information](#token-information)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Core Features
- **Multi-Chain Token Deployment**: Deploy ERC-20/SPL tokens on Solana, Ethereum, BNB Smart Chain, and Gorrillazz custom chain
- **Dual Native Stablecoins**: GORR and USDCc with 1:1 USD peg on Gorrillazz network
- **Cross-Chain Bridge**: Seamlessly swap and bridge tokens between networks
- **Liquidity Management**: Create and manage liquidity pools with customizable lock periods
- **Token Registry**: CoinGecko-style verification system with logo authorization
- **Wallet Integration**: Support for MetaMask, Trust Wallet, Binance Wallet, and custom Gorrillazz wallet

### Advanced Features
- **Admin Dashboard**: Comprehensive token verification and management system
- **Token Creator Wizard**: 5-step guided token creation process
- **Portfolio Tracking**: Real-time balance and price tracking across all networks
- **Trade History**: Complete transaction history with network explorer links
- **Custom Token Import**: Import and track any ERC-20/SPL token
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
- **Solana**: @solana/web3.js, @solana/spl-token
- **Ethereum/BNB**: ethers.js v6
- **Wallet Integration**: Web3 providers (MetaMask, Trust Wallet, Binance Wallet)

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
│   └── wallet-context.tsx      # Wallet state management
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

# Blockchain RPC Endpoints
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
BNB_RPC_URL=https://bsc-dataseed.binance.org/

# Private Keys (KEEP SECURE!)
SOLANA_PRIVATE_KEY=your_base58_private_key
ETHEREUM_PRIVATE_KEY=0x...
BNB_PRIVATE_KEY=0x...
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

- [ ] Add all environment variables in Vercel dashboard
- [ ] Connect Neon database integration
- [ ] Run database migrations (`npx prisma db push`)
- [ ] Update admin credentials (change default password)
- [ ] Test all API endpoints
- [ ] Verify wallet connections work
- [ ] Test token creation flow
- [ ] Check admin dashboard access
- [ ] Enable Vercel Analytics
- [ ] Set up custom domain (optional)

### Environment Variables in Vercel

1. Go to your project in Vercel dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add all variables from `.env.example`
4. Redeploy the application

---

## 📡 API Documentation

### Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.vercel.app/api`

### Public Endpoints

#### Tokens

\`\`\`http
GET /api/tokens/index
\`\`\`
Get all tokens with prices and metadata.

**Response:**
\`\`\`json
{
  "tokens": [
    {
      "id": "gorr",
      "name": "GORR",
      "symbol": "GORR",
      "price": 1.00,
      "change24h": 0.00,
      "network": "GORR",
      "logo": "/gorr-logo.png"
    }
  ],
  "popular": [...],
  "total": 100
}
\`\`\`

---

\`\`\`http
POST /api/tokens/verify
\`\`\`
Submit a token for verification.

**Body:**
\`\`\`json
{
  "name": "My Token",
  "symbol": "MTK",
  "contractAddress": "0x...",
  "network": "ethereum",
  "logoUrl": "https://...",
  "website": "https://...",
  "walletAddress": "0x..."
}
\`\`\`

---

\`\`\`http
POST /api/tokens/import
\`\`\`
Import a custom token.

**Body:**
\`\`\`json
{
  "contractAddress": "0x...",
  "network": "ethereum",
  "name": "Custom Token",
  "symbol": "CTK",
  "decimals": 18,
  "logoUrl": "https://..."
}
\`\`\`

---

#### Swap & Bridge

\`\`\`http
POST /api/swap/quote
\`\`\`
Get a swap quote.

**Body:**
\`\`\`json
{
  "fromToken": "GORR",
  "toToken": "USDCc",
  "amount": "100",
  "network": "GORR"
}
\`\`\`

---

\`\`\`http
POST /api/swap/execute
\`\`\`
Execute a token swap.

**Body:**
\`\`\`json
{
  "fromToken": "GORR",
  "toToken": "USDCc",
  "amount": "100",
  "slippage": 0.5,
  "walletAddress": "gorr_..."
}
\`\`\`

---

\`\`\`http
POST /api/bridge/execute
\`\`\`
Bridge tokens across chains.

**Body:**
\`\`\`json
{
  "token": "GORR",
  "amount": "100",
  "fromNetwork": "ethereum",
  "toNetwork": "bnb",
  "walletAddress": "0x..."
}
\`\`\`

---

#### Wallet

\`\`\`http
GET /api/wallet/balance?address=0x...
\`\`\`
Get wallet balance across all networks.

---

\`\`\`http
POST /api/wallet/send
\`\`\`
Send tokens to another wallet.

**Body:**
\`\`\`json
{
  "token": "GORR",
  "amount": "10",
  "toAddress": "gorr_...",
  "network": "GORR",
  "fromAddress": "gorr_...",
  "memo": "Payment"
}
\`\`\`

---

\`\`\`http
GET /api/wallet/trades?address=0x...
\`\`\`
Get trade history for a wallet.

---

### Admin Endpoints (Authenticated)

All admin endpoints require authentication via session cookie.

\`\`\`http
POST /api/admin/login
\`\`\`
Admin login.

**Body:**
\`\`\`json
{
  "username": "admin",
  "password": "your_password"
}
\`\`\`

---

\`\`\`http
GET /api/admin/tokens/pending
\`\`\`
Get pending token verifications.

---

\`\`\`http
POST /api/admin/tokens/approve
\`\`\`
Approve a token verification.

**Body:**
\`\`\`json
{
  "tokenId": "token_id_here"
}
\`\`\`

---

\`\`\`http
POST /api/admin/tokens/reject
\`\`\`
Reject a token verification.

**Body:**
\`\`\`json
{
  "tokenId": "token_id_here",
  "reason": "Does not meet criteria"
}
\`\`\`

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
- **Type**: Stablecoin (1:1 USD peg)
- **Initial Supply**: 400,000,000 GORR
- **Contract Address**: `gorr_native`
- **Treasury Wallet**: `gorr_assdypat2t`
- **Decimals**: 18
- **Features**:
  - FREE token registration
  - FREE logo verification
  - Cross-chain bridging to ETH, BNB, SOL
  - Used for platform fees

### USDCc (USD Coin Custom)

- **Network**: Gorrillazz Chain
- **Type**: Stablecoin (1:1 USD peg)
- **Initial Supply**: 400,000,000 USDCc
- **Contract Address**: `gorr_usdcc`
- **Decimals**: 18
- **Features**:
  - FREE token registration
  - FREE logo verification
  - Cross-chain bridging
  - Trading pair with GORR

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

#### Database Connection Failed

\`\`\`bash
Error: Can't reach database server
\`\`\`

**Solution:**
- Verify `DATABASE_URL` is correct
- Check Neon database is running
- Ensure SSL mode is enabled: `?sslmode=require`

---

#### Wallet Connection Issues

\`\`\`bash
Error: No Ethereum provider found
\`\`\`

**Solution:**
- Install MetaMask or Trust Wallet browser extension
- Refresh the page
- Check wallet is unlocked

---

#### Token Deployment Failed

\`\`\`bash
Error: Insufficient funds for gas
\`\`\`

**Solution:**
- Ensure wallet has enough native currency (ETH, BNB, SOL)
- Check RPC endpoint is responding
- Verify private key has correct permissions

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

### Getting Help

- **GitHub Issues**: [Report a bug](https://github.com/your-org/gorrillazz/issues)
- **Documentation**: Check this README
- **Community**: Join our Discord/Telegram

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and Neon integration
- Radix UI and shadcn/ui for components
- Three.js community for WebGL support
- Solana and Ethereum communities

---

## 🚀 Roadmap

- [ ] Mobile app (React Native)
- [ ] Additional chain support (Polygon, Avalanche)
- [ ] NFT marketplace integration
- [ ] Governance token (DAO)
- [ ] Advanced trading features
- [ ] Staking and yield farming

---

**Built with ❤️ by the Gorrillazz Team**

For questions or support, contact: support@gorrillazz.network
