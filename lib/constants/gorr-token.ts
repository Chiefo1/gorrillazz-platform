export const GORR_TOKEN = {
  name: "Gorrillazz",
  symbol: "GORR",
  decimals: 18,
  totalSupply: 400000000, // Changed from string to number for calculations
  initialWallet: "gorr_assdypat2t",
  logoUrl: "/gorr-logo.png",
  description: "Native stablecoin of the Gorrillazz platform",
  price: 1.0, // $1.00 USD stablecoin (1:1 peg)
  chain: "gorrillazz",
  verified: true,
  type: "stablecoin",
}

export const USDCC_TOKEN = {
  name: "USD Coin Custom",
  symbol: "USDCc",
  decimals: 6,
  totalSupply: 400000000, // Changed from string to number for calculations
  initialWallet: "gorr_assdypat2t", // Same wallet as GORR on GORR network
  logoUrl: "/usdcc-logo.png",
  description: "Custom USD Coin on Gorrillazz network",
  price: 1.0, // $1.00 USD stablecoin (1:1 peg)
  chain: "gorrillazz", // Changed from ethereum to gorrillazz
  verified: true,
  type: "stablecoin",
}

export const SUPPORTED_CHAINS = [
  { id: "ethereum", name: "Ethereum", symbol: "ETH", color: "#627EEA" },
  { id: "bnb", name: "BNB Chain", symbol: "BNB", color: "#F3BA2F" },
  { id: "solana", name: "Solana", symbol: "SOL", color: "#14F195" },
  { id: "gorrillazz", name: "Gorrillazz", symbol: "GORR", color: "#9333EA" },
] as const
