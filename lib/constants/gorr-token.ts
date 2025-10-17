export const GORR_TOKEN = {
  name: "Gorrillazz",
  symbol: "GORR",
  decimals: 18,
  totalSupply: 400000000,
  initialWallet: "gorr_assdypat2t",
  address: process.env.GORR_CONTRACT_ADDRESS_GORRILLAZZ || "gorr_native_token",
  logoUrl: "/gorr-logo.svg",
  description: "Native stablecoin of the Gorrillazz platform - 1:1 EUR peg",
  price: 1.0, // 1 GORR = 1 EUR
  priceInEUR: 1.0,
  priceInUSD: 1.09, // Approximate EUR to USD conversion
  chain: "gorrillazz",
  chainId: process.env.GORRILLAZZ_CHAIN_ID || "9999",
  rpcUrl: process.env.GORRILLAZZ_RPC_URL || "https://rpc.gorrillazz.network",
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
  address: process.env.USDCC_CONTRACT_ADDRESS_GORRILLAZZ || "gorr_usdcc",
  logoUrl: "/usdcc-logo.png",
  description: "Custom USD Coin on Gorrillazz network - 1:1 USD peg",
  price: 1.0, // 1 USDCc = 1 USD
  priceInEUR: 0.92, // Approximate USD to EUR conversion
  priceInUSD: 1.0,
  chain: "gorrillazz",
  chainId: process.env.GORRILLAZZ_CHAIN_ID || "9999",
  rpcUrl: process.env.GORRILLAZZ_RPC_URL || "https://rpc.gorrillazz.network",
  verified: true,
  type: "stablecoin",
  isPrimary: false,
}

export const SUPPORTED_CHAINS = [
  {
    id: "gorrillazz",
    name: "Gorrillazz",
    symbol: "GORR",
    color: "#9333EA",
    isPrimary: true,
    chainId: process.env.GORRILLAZZ_CHAIN_ID || "9999",
    rpcUrl: process.env.GORRILLAZZ_RPC_URL || "https://rpc.gorrillazz.network",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    color: "#627EEA",
    isPrimary: false,
    chainId: "1",
    rpcUrl: process.env.ETHEREUM_RPC_URL || "https://mainnet.infura.io/v3/your_infura_project_id",
  },
] as const
