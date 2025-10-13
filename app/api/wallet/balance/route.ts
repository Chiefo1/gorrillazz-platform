import { NextResponse } from "next/server"
import { GORR_TOKEN } from "@/lib/constants/gorr-token"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get("wallet")
  const chain = searchParams.get("chain")

  if (!wallet) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
  }

  try {
    const isGorrInitialWallet = wallet === GORR_TOKEN.initialWallet

    const balances = {
      wallet,
      chain,
      tokens: [
        {
          symbol: "GORR",
          name: "Gorrillazz",
          balance: isGorrInitialWallet ? GORR_TOKEN.totalSupply : "1000.00",
          price: 1.0,
          value: isGorrInitialWallet ? 400000000 : 1000,
          chain: "gorrillazz",
        },
        {
          symbol: chain === "ethereum" ? "ETH" : chain === "bnb" ? "BNB" : "SOL",
          name: chain === "ethereum" ? "Ethereum" : chain === "bnb" ? "BNB" : "Solana",
          balance: "2.5",
          price: chain === "ethereum" ? 3245.67 : chain === "bnb" ? 312.45 : 98.76,
          value: chain === "ethereum" ? 8114.18 : chain === "bnb" ? 781.13 : 246.9,
          chain: chain || "ethereum",
        },
      ],
      totalValue: isGorrInitialWallet ? 400008114.18 : 9114.18,
    }

    return NextResponse.json(balances)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 })
  }
}
