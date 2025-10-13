export const GORR_TOKEN = {
  name: "Gorrillazz",
  symbol: "GORR",
  decimals: 18,
  totalSupply: "400000000", // 400 million
  initialWallet: "gorr_assdypat2t",
  logoUrl: "/new-gorr-logo.png", // Updated logo path to use the new GORR logo
  description: "Native stablecoin of the Gorrillazz platform",
  price: 1.0, // $1.00 USD stablecoin
}

export const SUPPORTED_CHAINS = [
  { id: "ethereum", name: "Ethereum", symbol: "ETH", color: "#627EEA" },
  { id: "bnb", name: "BNB Chain", symbol: "BNB", color: "#F3BA2F" },
  { id: "solana", name: "Solana", symbol: "SOL", color: "#14F195" },
  { id: "gorrillazz", name: "Gorrillazz", symbol: "GORR", color: "#9333EA" },
] as const
