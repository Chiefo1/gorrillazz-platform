export const GORR_TOKEN = {
  name: "Gorrillazz",
  symbol: "GORR",
  decimals: 18,
  totalSupply: 400000000,
  initialWallet: "gorr_assdypat2t",
  logoUrl: "/gorr-logo.svg",
  description: "Native stablecoin of the Gorrillazz platform - 1:1 EUR peg",
  price: 1.0, // 1 GORR = 1 EUR
  priceInEUR: 1.0,
  priceInUSD: 1.09, // Approximate EUR to USD conversion
  chain: "gorrillazz",
  verified: true,
  type: "stablecoin",
  isPrimary: true,
}

export const USDCC_TOKEN = {
  name: "USD Coin Custom",
  symbol: "USDCc",
  decimals: 6,
  totalSupply: 400000000,
  initialWallet: "gorr_assdypat2t",
  logoUrl: "/usdcc-logo.png",
  description: "Custom USD Coin on Gorrillazz network - 1:1 USD peg",
  price: 1.0, // 1 USDCc = 1 USD
  priceInEUR: 0.92, // Approximate USD to EUR conversion
  priceInUSD: 1.0,
  chain: "gorrillazz",
  verified: true,
  type: "stablecoin",
  isPrimary: false,
}

export const SUPPORTED_CHAINS = [
  { id: "gorrillazz", name: "Gorrillazz", symbol: "GORR", color: "#9333EA", isPrimary: true },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", color: "#627EEA", isPrimary: false },
  { id: "bnb", name: "BNB Chain", symbol: "BNB", color: "#F3BA2F", isPrimary: false },
  { id: "solana", name: "Solana", symbol: "SOL", color: "#14F195", isPrimary: false },
] as const
