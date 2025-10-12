# 🦍 Gorrillazz Platform

A multi-chain token creation platform with native GORR stablecoin.

## Features

- **Multi-Chain Support**: Deploy tokens on Solana, Ethereum, BNB Smart Chain, and Gorrillazz custom chain
- **Liquidity Management**: Create and manage liquidity pools with lock periods
- **Wallet Integration**: Support for Phantom, MetaMask, and custom Gorrillazz wallet
- **GORR Stablecoin**: Native stablecoin for platform transactions
- **Glassmorphic UI**: Premium iOS 26.1.1 inspired design with shader backgrounds

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Animations**: Framer Motion, @paper-design/shaders-react
- **Database**: MongoDB (Digital Ocean)
- **Blockchain SDKs**:
  - Solana: @solana/web3.js, @solana/spl-token
  - Ethereum/BNB: ethers.js
- **Storage**: Digital Ocean Spaces, IPFS, Arweave

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

3. **Initialize MongoDB**
Run the initialization script to create collections and indexes:
\`\`\`bash
python scripts/init-mongodb.py
\`\`\`

4. **Run Development Server**
\`\`\`bash
npm run dev
\`\`\`

## Environment Variables

See `.env.example` for all required environment variables including:
- MongoDB connection (Digital Ocean)
- Blockchain RPC URLs (Solana, Ethereum, BNB)
- Private keys for token deployment
- IPFS/Arweave configuration
- Digital Ocean Spaces credentials

## Deployment

Deploy to Vercel with one click or use the Vercel CLI:
\`\`\`bash
vercel deploy
\`\`\`

Make sure to add all environment variables in your Vercel project settings.

## License

MIT
