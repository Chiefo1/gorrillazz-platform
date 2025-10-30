#!/usr/bin/env node

/**
 * GORRILLAZZ — Production Setup Script
 * -------------------------------------
 * This script finalizes the app for production deployment by:
 * 1. Ensuring all required environment variables are set (creates .env.production if missing)
 * 2. Scanning the codebase for mock/placeholder data
 * 3. Running optional database seed
 * 4. Verifying build integrity
 * 5. Printing a clean production summary
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🚀 GORRILLAZZ Production Setup\n");

// --- CONFIG --------------------------------------------------

const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "ADMIN_USERNAME",
  "ADMIN_PASSWORD",
  "NEXT_PUBLIC_ADMIN_WALLET_ADDRESS",
  "GORRILLAZZ_RPC_URL",
  "GORRILLAZZ_CHAIN_ID",
  "GORRILLAZZ_PRIVATE_KEY",
  "GORR_CONTRACT_ADDRESS_GORRILLAZZ",
  "USDCC_CONTRACT_ADDRESS_GORRILLAZZ",
  "ETHEREUM_RPC_URL",
  "ETHEREUM_PRIVATE_KEY",
];

const ENV_PATH = path.join(process.cwd(), ".env.production");

// --- STEP 1: Ensure .env.production exists -------------------

if (!fs.existsSync(ENV_PATH)) {
  console.log("🧾 No .env.production found — creating a template...");

  const envTemplate = `# GORRILLAZZ Production Environment

DATABASE_URL=
ADMIN_USERNAME=admin
ADMIN_PASSWORD=

NEXT_PUBLIC_ADMIN_WALLET_ADDRESS=0x9Fe0B2d8412A7E21195B08D7F119A90907e5aC74

GORRILLAZZ_RPC_URL=wss://ws.gorrillazz.network
GORRILLAZZ_CHAIN_ID=7777
GORRILLAZZ_PRIVATE_KEY=

GORR_CONTRACT_ADDRESS_GORRILLAZZ=
USDCC_CONTRACT_ADDRESS_GORRILLAZZ=gorr_usdcc

ETHEREUM_RPC_URL=
ETHEREUM_PRIVATE_KEY=
`;

  fs.writeFileSync(ENV_PATH, envTemplate, "utf8");
  console.log("✅ Created .env.production template — fill missing values before continuing.\n");
} else {
  console.log("✅ Found .env.production\n");
}

// --- STEP 2: Check environment variables --------------------

require("dotenv").config({ path: ENV_PATH });
console.log("📋 Checking environment variables...");

const missingVars = REQUIRED_ENV_VARS.filter((v) => !process.env[v] || process.env[v].trim() === "");

if (missingVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingVars.forEach((v) => console.error(`   - ${v}`));
  console.error("\n💡 Fill in these in .env.production before proceeding.\n");
  process.exit(1);
}

console.log("✅ All required environment variables are set\n");

// --- STEP 3: Scan for mock data ------------------------------

console.log("🔍 Scanning for mock data and hardcoded values...");

const mockPatterns = [
  /mock[A-Z]\w+/gi,
  /placeholder/gi,
  /test[_-]?\w+/gi,
  /gorr_admin_wallet_2024/gi,
  /0x\.\.\./g,
];

const scanDirs = ["lib", "app/api"];
const foundIssues = [];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  mockPatterns.forEach((pattern) => {
    const matches = content.match(pattern);
    if (matches) {
      foundIssues.push({ file: filePath, matches });
    }
  });
}

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      scanDirectory(filePath);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      scanFile(filePath);
    }
  }
}

scanDirs.forEach(scanDirectory);

if (foundIssues.length > 0) {
  console.warn("⚠️ Found potential mock or hardcoded values:");
  foundIssues.forEach((issue) =>
    console.warn(`   ${issue.file}: ${issue.matches.join(", ")}`)
  );
  console.warn("\n💡 Review these files before production.\n");
} else {
  console.log("✅ No mock data found\n");
}

// --- STEP 4: Run database seed (optional) --------------------

console.log("🧩 Checking for database seed script...");
const pkgPath = path.join(process.cwd(), "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

if (pkg.scripts && pkg.scripts["db:seed"]) {
  try {
    console.log("🌱 Running database seed...");
    execSync("npm run db:seed", { stdio: "inherit" });
    console.log("✅ Database seed completed successfully.\n");
  } catch (err) {
    console.error("❌ Database seed failed.");
    console.error(err.message);
    process.exit(1);
  }
} else {
  console.warn("⚠️ No db:seed script found in package.json (skipping seeding).\n");
}

// --- STEP 5: Verify build ------------------------------------

console.log("🏗️  Verifying production build...");

try {
  execSync("npm run build", { stdio: "inherit" });
  console.log("✅ Build verification successful.\n");
} catch (err) {
  console.error("❌ Build failed! Fix build issues before deployment.\n");
  process.exit(1);
}

// --- STEP 6: Summary -----------------------------------------

console.log("📊 Production Configuration Summary:");
console.log(`   Admin Wallet: ${process.env.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS}`);
console.log(`   GORR Contract: ${process.env.GORR_CONTRACT_ADDRESS_GORRILLAZZ}`);
console.log(`   USDCc Contract: ${process.env.USDCC_CONTRACT_ADDRESS_GORRILLAZZ}`);
console.log(`   RPC Endpoint: ${process.env.GORRILLAZZ_RPC_URL}`);
console.log(`   Ethereum RPC: ${process.env.ETHEREUM_RPC_URL}`);
console.log(`   Database: ${process.env.DATABASE_URL.split("@")[1]?.split("/")[0] || "Connected"}`);

console.log("\n✅ Production setup complete!");
console.log("\n📝 Next steps:");
console.log("   1. Review .env.production for any missing or placeholder values");
console.log("   2. Run: npm run start");
console.log("   3. Deploy to Vercel / Render / your host");
console.log("   4. Verify contracts on explorer:");
console.log("        https://explorer.gorrillazz.network");
console.log("   5. Configure DNS + SSL");
console.log("\n🎉 GORRILLAZZ is ready for production!\n");
