#!/usr/bin/env node

/**
 * 🌱 GORRILLAZZ — Database Seed Script
 * -------------------------------------
 * Seeds production database with:
 *  - Admin wallet
 *  - Default tokens (GORR, USDCc)
 *  - Fee structure
 *  - Optional placeholders for future tokens
 *
 * Works with Prisma (recommended) or generic DB connection.
 */

import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client"; // If using Prisma ORM
import crypto from "crypto";
import { ethers } from "ethers";
import chalk from "chalk";

dotenv.config({ path: ".env" });

console.log("🚀 Starting GORRILLAZZ database seed...");
    
const prisma = new PrismaClient();
const FUND_AMOUNT = "500000"; // GORR to fund admin wallet


console.log(chalk.bold("\n🚀 Starting GORRILLAZZ production seed...\n"));

// -----------------------------------------------------------
// 1️⃣ ENV VALIDATION
// -----------------------------------------------------------
const REQUIRED = [
  "DATABASE_URL",
  "NEXT_PUBLIC_ADMIN_WALLET_ADDRESS",
  "GORR_CONTRACT_ADDRESS_GORRILLAZZ",
  "USDCC_CONTRACT_ADDRESS_GORRILLAZZ",
  "GORRILLAZZ_RPC_URL",
  "GORRILLAZZ_PRIVATE_KEY",
];

const missing = REQUIRED.filter((v) => !process.env[v]);
if (missing.length) {
  console.error(chalk.red("❌ Missing environment variables:"));
  missing.forEach((v) => console.error("   - " + v));
  process.exit(1);
}

const adminWalletAddr = process.env.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS;
const gorrAddress = process.env.GORR_CONTRACT_ADDRESS_GORRILLAZZ;
const usdccAddress = process.env.USDCC_CONTRACT_ADDRESS_GORRILLAZZ;

// -----------------------------------------------------------
// 2️⃣ CONTRACT VALIDATION
// -----------------------------------------------------------
async function validateContracts() {
  console.log(chalk.cyan("🔍 Validating contract addresses...\n"));
  const provider = new ethers.JsonRpcProvider(process.env.GORRILLAZZ_RPC_URL);

  const results = [];

  async function check(label, address) {
    try {
      const code = await provider.getCode(address);
      if (code && code !== "0x") {
        console.log(chalk.green(`✅ ${label} contract verified on chain: ${address}`));
        results.push(true);
      } else {
        console.log(chalk.red(`❌ ${label} contract not found at ${address}`));
        results.push(false);
      }
    } catch (err) {
      console.log(chalk.yellow(`⚠️ Unable to verify ${label}: ${err.message}`));
      results.push(false);
    }
  }

  await check("GORR", gorrAddress);
  await check("USDCc", usdccAddress);

  if (results.includes(false)) {
    console.log(chalk.red("\n❌ One or more contracts could not be verified. Fix before production.\n"));
    process.exit(1);
  } else {
    console.log(chalk.green("\n✅ All contract addresses validated successfully!\n"));
  }
}

// -----------------------------------------------------------
// 3️⃣ DATABASE SEEDING
// -----------------------------------------------------------
const defaultTokens = [
  {
    symbol: "GORR",
    name: "Gorrillazz Token",
    contractAddress: gorrAddress,
    decimals: 18,
    priceUSD: 1.09,
    chain: "GORRILLAZZ",
    fee: 0,
  },
  {
    symbol: "USDCc",
    name: "USD GORRILLAZZ Coin",
    contractAddress: usdccAddress,
    decimals: 6,
    priceUSD: 1.0,
    chain: "GORRILLAZZ",
    fee: 0,
  },
];

const otherFee = 200; // 200 GORR fee for non-core tokens

async function seedDatabase() {
  console.log(chalk.cyan("🧩 Connecting to database..."));
  await prisma.$connect();

  // Admin Wallet
  let admin = await prisma.wallet.findUnique({ where: { address: adminWalletAddr } });
  if (!admin) {
    console.log(chalk.green(`👑 Creating admin wallet: ${adminWalletAddr}`));
    admin = await prisma.wallet.create({
      data: {
        address: adminWalletAddr,
        label: "Admin Wallet",
        isAdmin: true,
        balance: 0,
      },
    });
  } else {
    console.log(chalk.yellow(`⚙️  Admin wallet already exists.`));
  }

  // Tokens
  console.log(chalk.cyan("\n🪙 Seeding tokens..."));
  for (const token of defaultTokens) {
    const exists = await prisma.token.findUnique({
      where: { contractAddress: token.contractAddress },
    });
    if (!exists) {
      await prisma.token.create({ data: token });
      console.log(chalk.green(`   ✅ Added ${token.symbol}`));
    } else {
      console.log(chalk.yellow(`   ↪ ${token.symbol} already exists`));
    }
  }

  // Fee structure
  const feeConfig = await prisma.feeConfig.findFirst();
  if (!feeConfig) {
    await prisma.feeConfig.create({
      data: {
        freeTokens: ["GORR", "USDCc"],
        verificationFeeGORR: otherFee,
      },
    });
    console.log(chalk.green("💰 Fee structure created"));
  } else {
    console.log(chalk.yellow("💰 Fee structure already exists"));
  }

  // Token verification registry
  const registry = await prisma.tokenVerification.findFirst();
  if (!registry) {
    await prisma.tokenVerification.create({
      data: {
        verifiedTokens: ["GORR", "USDCc"],
        pendingTokens: [],
      },
    });
    console.log(chalk.green("🔏 Token verification registry initialized"));
  } else {
    console.log(chalk.yellow("🔏 Registry already exists"));
  }

  console.log(chalk.green("\n✅ Database seeded successfully!\n"));
  await prisma.$disconnect();
}

// -----------------------------------------------------------
// 4️⃣ FUND ADMIN WALLET IF EMPTY
// -----------------------------------------------------------
async function fundAdminWallet() {
  console.log(chalk.cyan("💸 Checking admin wallet balance..."));
  const provider = new ethers.JsonRpcProvider(process.env.GORRILLAZZ_RPC_URL);
  const funder = new ethers.Wallet(process.env.GORRILLAZZ_PRIVATE_KEY, provider);
  const erc20ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function decimals() view returns (uint8)",
  ];
  const token = new ethers.Contract(gorrAddress, erc20ABI, funder);

  const decimals = await token.decimals();
  const balance = await token.balanceOf(adminWalletAddr);
  const humanBalance = Number(ethers.formatUnits(balance, decimals));

  if (humanBalance > 0) {
    console.log(chalk.yellow(`💰 Admin wallet already funded: ${humanBalance} GORR\n`));
    return;
  }

  console.log(chalk.green(`🚀 Funding admin wallet with ${FUND_AMOUNT} GORR...`));
  const tx = await token.transfer(
    adminWalletAddr,
    ethers.parseUnits(FUND_AMOUNT, decimals)
  );
  console.log(chalk.cyan(`⏳ Transaction sent: ${tx.hash}`));

  await tx.wait(2);
  console.log(chalk.green(`✅ Admin wallet funded with ${FUND_AMOUNT} GORR!\n`));
}

// -----------------------------------------------------------
// 5️⃣ MAIN EXECUTION
// -----------------------------------------------------------
(async () => {
  try {
    await validateContracts();
    await seedDatabase();
    await fundAdminWallet();

    console.log(chalk.bold.green("\n🎉 GORRILLAZZ production seed + funding complete!\n"));
    console.log("Next steps:");
    console.log("  • Verify DB records and wallet balance");
    console.log("  • Run: npm run build && npm start");
    console.log("  • Deploy to production");
  } catch (err) {
    console.error(chalk.red("\n❌ Seed failed:"), err);
    await prisma.$disconnect();
    process.exit(1);
  }
})();