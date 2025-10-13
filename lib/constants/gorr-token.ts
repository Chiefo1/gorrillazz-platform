export const GORR_TOKEN = {
  name: "Gorrillazz",
  symbol: "GORR",
  decimals: 18,
  totalSupply: "400000000", // 400 million
  initialWallet: "gorr_assdypat2t",
  logoUrl: "/gorr-logo.png",
  description: "Native stablecoin of the Gorrillazz platform",
  price: 1.0, // $1.00 USD stablecoin
}

export const USDCC_TOKEN = {
  name: "USD Coin Custom",
  symbol: "USDCc",
  decimals: 6,
  totalSupply: "400000000", // 400 million
  initialWallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  logoUrl: "/usdcc-logo.png",
  description: "Custom USD Coin on Ethereum network",
  price: 1.0, // $1.00 USD stablecoin
  chain: "ethereum",
}

export const SUPPORTED_CHAINS = [
  { id: "ethereum", name: "Ethereum", symbol: "ETH", color: "#627EEA" },
  { id: "bnb", name: "BNB Chain", symbol: "BNB", color: "#F3BA2F" },
  { id: "solana", name: "Solana", symbol: "SOL", color: "#14F195" },
  { id: "gorrillazz", name: "Gorrillazz", symbol: "GORR", color: "#9333EA" },
] as const
