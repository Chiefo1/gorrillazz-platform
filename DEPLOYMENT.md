# 🚀 Gorrillazz Platform - Deployment Guide

This guide will walk you through deploying the Gorrillazz platform to Vercel with all necessary configurations.

## Prerequisites

- Vercel account ([sign up here](https://vercel.com/signup))
- Neon PostgreSQL account ([sign up here](https://neon.tech))
- GitHub account (for repository hosting)
- Blockchain RPC endpoints (Infura, Alchemy, or QuickNode)

---

## Step 1: Push to GitHub

\`\`\`bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/your-username/gorrillazz.git
git branch -M main
git push -u origin main
\`\`\`

---

## Step 2: Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js framework

**DO NOT deploy yet!** We need to set up environment variables first.

---

## Step 3: Connect Neon Database

### Option A: Using Vercel Integration (Recommended)

1. In your Vercel project, go to "Storage" tab
2. Click "Connect Store" → "Neon"
3. Follow the prompts to create/connect a Neon database
4. Vercel will automatically add `DATABASE_URL` to your environment variables

### Option B: Manual Setup

1. Create a database at [neon.tech](https://neon.tech)
2. Copy the connection string
3. Add it to Vercel environment variables (see Step 4)

---

## Step 4: Add Environment Variables

In your Vercel project dashboard:

1. Go to "Settings" → "Environment Variables"
2. Add the following variables for **Production**, **Preview**, and **Development**:

### Required Variables

\`\`\`bash
# Database (auto-added if using Neon integration)
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# Admin Dashboard
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here

# Blockchain RPC Endpoints
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
BNB_RPC_URL=https://bsc-dataseed.binance.org/

# Deployment Keys (KEEP SECURE!)
SOLANA_PRIVATE_KEY=your_base58_private_key
ETHEREUM_PRIVATE_KEY=0x...
BNB_PRIVATE_KEY=0x...
\`\`\`

### Optional Variables

\`\`\`bash
# IPFS Storage (for token metadata)
IPFS_API_KEY=your_pinata_api_key
IPFS_API_SECRET=your_pinata_secret

# Arweave Storage
ARWEAVE_WALLET_KEY=your_arweave_key

# Custom Configuration
TOKEN_REGISTRATION_FEE=200
TREASURY_WALLET_ADDRESS=gorr_treasury_wallet
\`\`\`

### How to Add Variables

For each variable:
1. Click "Add New"
2. Enter the **Key** (e.g., `ADMIN_USERNAME`)
3. Enter the **Value** (e.g., `admin`)
4. Select environments: ✅ Production ✅ Preview ✅ Development
5. Click "Save"

---

## Step 5: Deploy

1. Click "Deploy" button in Vercel
2. Wait for the build to complete (2-3 minutes)
3. Once deployed, you'll get a URL like `https://your-project.vercel.app`

---

## Step 6: Initialize Database

After first deployment, initialize the database:

### Option A: Using Vercel CLI

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run Prisma commands
vercel env pull .env.local
npx prisma generate
npx prisma db push
\`\`\`

### Option B: Using Neon Console

1. Go to your Neon dashboard
2. Open SQL Editor
3. Copy and paste the contents of `scripts/init-database.sql`
4. Execute the script

---

## Step 7: Verify Deployment

Test these endpoints to ensure everything works:

\`\`\`bash
# Health check
curl https://your-project.vercel.app/api/tokens/index

# GORR price
curl https://your-project.vercel.app/api/gorr/price

# Token list
curl https://your-project.vercel.app/token-list.json
\`\`\`

Visit your site and test:
- ✅ Homepage loads
- ✅ Wallet connection works
- ✅ Token creator wizard opens
- ✅ Admin dashboard login works
- ✅ Wallet page displays tokens

---

## Step 8: Post-Deployment Configuration

### Update Admin Password

1. Go to Vercel dashboard → Settings → Environment Variables
2. Update `ADMIN_PASSWORD` to a strong password
3. Redeploy the application

### Set Up Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate to be issued

### Enable Analytics

1. Go to Analytics tab
2. Enable Vercel Analytics
3. Add analytics script to your site (optional)

---

## Troubleshooting

### Build Fails

**Error: Module not found**
\`\`\`bash
# Solution: Clear cache and redeploy
vercel --force
\`\`\`

**Error: TypeScript errors**
\`\`\`bash
# Solution: Fix TypeScript errors locally first
npm run build
# Fix any errors, then commit and push
\`\`\`

### Database Connection Issues

**Error: Can't reach database server**
- Verify `DATABASE_URL` is correct in environment variables
- Check Neon database is running
- Ensure connection string includes `?sslmode=require`

### Environment Variables Not Working

**Error: Environment variable undefined**
- Make sure variables are added to all environments (Production, Preview, Development)
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

### API Endpoints Return 500

**Error: Internal Server Error**
- Check Vercel function logs: Dashboard → Deployments → [Latest] → Functions
- Verify all required environment variables are set
- Check database connection is working

---

## Monitoring & Maintenance

### View Logs

\`\`\`bash
# Real-time logs
vercel logs --follow

# Logs for specific deployment
vercel logs [deployment-url]
\`\`\`

### Database Backups

Neon automatically backs up your database. To create manual backup:
1. Go to Neon dashboard
2. Select your project
3. Click "Backups" → "Create Backup"

### Update Dependencies

\`\`\`bash
# Check for updates
npm outdated

# Update packages
npm update

# Test locally
npm run build
npm start

# Deploy
git add .
git commit -m "Update dependencies"
git push
\`\`\`

---

## Security Checklist

Before going to production:

- [ ] Change default admin password
- [ ] Use strong, unique passwords for all services
- [ ] Enable 2FA on Vercel account
- [ ] Enable 2FA on Neon account
- [ ] Use separate private keys for production
- [ ] Store private keys in Vercel environment variables (never in code)
- [ ] Enable Vercel's DDoS protection
- [ ] Set up monitoring and alerts
- [ ] Review and limit API rate limits
- [ ] Enable HTTPS only (Vercel does this by default)

---

## Scaling Considerations

### Database

- Neon Free Tier: 0.5 GB storage, 1 compute unit
- Upgrade to Pro for more resources
- Enable connection pooling for high traffic

### Vercel

- Free Tier: 100 GB bandwidth, 100 GB-hours compute
- Upgrade to Pro for unlimited bandwidth
- Use Edge Functions for better performance

### Blockchain RPCs

- Free tier RPC endpoints may rate limit
- Consider upgrading to paid plans for production
- Use multiple RPC endpoints for redundancy

---

## Support

If you encounter issues:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Check [Neon Documentation](https://neon.tech/docs)
3. Review application logs in Vercel dashboard
4. Open an issue on GitHub
5. Contact support@gorrillazz.network

---

**Deployment Complete! 🎉**

Your Gorrillazz platform is now live and ready for users.
