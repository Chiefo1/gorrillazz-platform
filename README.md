# 🦍 Gorrillazz Platform

A multi-chain token creation platform with native GORR and USDCc stablecoins.

## Features

- **Multi-Chain Support**: Deploy tokens on Solana, Ethereum, BNB Smart Chain, and Gorrillazz custom chain
- **Dual Stablecoins**: GORR and USDCc with 1:1 USD peg on Gorrillazz network
- **Token Registry**: CoinGecko-style verification system with logo authorization
- **Admin Dashboard**: Manage token verifications and registrations
- **Cross-Chain Bridge**: Swap tokens between networks seamlessly
- **Liquidity Management**: Create and manage liquidity pools with lock periods
- **Wallet Integration**: Support for Phantom, MetaMask, and custom Gorrillazz wallet
- **Glassmorphic UI**: Premium iOS 26.1.1 inspired design with shader backgrounds

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Animations**: Framer Motion, @paper-design/shaders-react
- **Database**: Neon PostgreSQL with Prisma ORM
- **Blockchain SDKs**:
  - Solana: @solana/web3.js, @solana/spl-token
  - Ethereum/BNB: ethers.js
- **Storage**: IPFS, Arweave

## Setup

1. **Install Dependencies**
\`\`\`bash
npm install
\`\`\`

2. **Configure Environment Variables**
Copy `.env.example` to `.env.local` and fill in your values:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Required variables:
- `DATABASE_URL`: Neon PostgreSQL connection string
- `ADMIN_USERNAME` & `ADMIN_PASSWORD`: Admin dashboard credentials
- Blockchain RPC URLs and private keys
- IPFS/Arweave configuration

3. **Connect Neon Database**
Connect your Neon integration through the Vercel dashboard or v0 interface.

4. **Initialize Database**
Run the SQL initialization script to create tables:
\`\`\`bash
# Execute scripts/init-database.sql in your Neon console
\`\`\`

5. **Run Development Server**
\`\`\`bash
npm run dev
\`\`\`

## Token Registry & Fees

The platform includes a token verification system similar to CoinGecko:

- **GORR Token**: FREE registration and verification
- **USDCc Token**: FREE registration and verification
- **Other Tokens**: 200 GORR registration fee

### Admin Dashboard

Access the admin dashboard at `/admin` to:
- Review pending token verifications
- Approve or reject token submissions
- Manage logo authorizations
- View fee structure

Default credentials (change in production):
- Username: `admin`
- Password: `gorr_admin_2024`

## Token Information

### GORR (Gorrillazz Stablecoin)
- **Network**: Gorrillazz Chain (native)
- **Initial Supply**: 400,000,000
- **Value**: 1:1 USD peg
- **Address**: `gorr_native`
- **Wallet**: `gorr_assdypat2t`

### USDCc (USD Coin Custom)
- **Network**: Gorrillazz Chain
- **Initial Supply**: 400,000,000
- **Value**: 1:1 USD peg
- **Address**: `gorr_usdcc`

Both tokens are fully tradeable, swappable, and bridgeable across all supported networks.

## Deployment

Deploy to Vercel with one click or use the Vercel CLI:
\`\`\`bash
vercel deploy
\`\`\`

Make sure to:
1. Add all environment variables in Vercel project settings
2. Connect Neon database integration
3. Update admin credentials for production

## API Endpoints

- `/api/tokens/index` - Get all tokens and prices
- `/api/tokens/verify` - Submit token for verification
- `/api/tokens/import` - Import custom token
- `/api/swap/quote` - Get swap quote
- `/api/swap/execute` - Execute token swap
- `/api/bridge/execute` - Bridge tokens across chains
- `/api/admin/*` - Admin dashboard endpoints (authenticated)

## License

MIT
