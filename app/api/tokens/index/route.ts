import { NextResponse } from "next/server"

// Mock token database
const ALL_TOKENS = [
  {
    id: "gorr",
    name: "Gorrillazz",
    symbol: "GORR",
    chain: "gorrillazz",
    price: 1.0,
    change24h: 0.0,
    marketCap: 400000000,
    volume24h: 5000000,
    logo: "/gorr-logo.png",
    isPopular: true,
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    chain: "ethereum",
    price: 3245.67,
    change24h: 2.34,
    marketCap: 390000000000,
    volume24h: 15000000000,
    logo: "/eth-logo.png",
    isPopular: true,
  },
  {
    id: "bnb",
    name: "BNB",
    symbol: "BNB",
    chain: "bnb",
    price: 312.45,
    change24h: -1.23,
    marketCap: 48000000000,
    volume24h: 1200000000,
    logo: "/bnb-logo.png",
    isPopular: true,
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    chain: "solana",
    price: 98.76,
    change24h: 5.67,
    marketCap: 42000000000,
    volume24h: 2500000000,
    logo: "/sol-logo.png",
    isPopular: true,
  },
  {
    id: "usdc",
    name: "USD Coin",
    symbol: "USDC",
    chain: "ethereum",
    price: 1.0,
    change24h: 0.01,
    marketCap: 25000000000,
    volume24h: 3000000000,
    logo: "/usdc-logo.png",
    isPopular: true,
  },
  {
    id: "usdt",
    name: "Tether",
    symbol: "USDT",
    chain: "ethereum",
    price: 1.0,
    change24h: -0.01,
    marketCap: 95000000000,
    volume24h: 45000000000,
    logo: "/usdt-logo.png",
    isPopular: true,
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") // 'all', 'popular', 'chain'
  const chain = searchParams.get("chain")

  try {
    let tokens = ALL_TOKENS

    if (type === "popular") {
      tokens = tokens.filter((t) => t.isPopular)
    }

    if (chain && chain !== "all") {
      tokens = tokens.filter((t) => t.chain === chain)
    }

    return NextResponse.json({ tokens, count: tokens.length })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tokens" }, { status: 500 })
  }
}
