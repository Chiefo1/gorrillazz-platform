import { NextResponse } from "next/server"
import { GORR_TOKEN, USDCC_TOKEN } from "@/lib/constants/gorr-token"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get("wallet")
  const chain = searchParams.get("chain")

  if (!wallet) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
  }

  try {
    const isGorrInitialWallet = wallet === GORR_TOKEN.initialWallet

    const gorrBalance = isGorrInitialWallet ? GORR_TOKEN.totalSupply : 1000.0
    const usdccBalance = isGorrInitialWallet ? USDCC_TOKEN.totalSupply : 500.0
    const nativeBalance = 2.5

    const nativePrice = chain === "ethereum" ? 3245.67 : chain === "bnb" ? 312.45 : chain === "solana" ? 98.76 : 0

    const balances = {
      wallet,
      chain,
      tokens: [
        {
          symbol: "GORR",
          name: "Gorrillazz",
          balance: gorrBalance.toString(),
          price: GORR_TOKEN.price,
          value: gorrBalance * GORR_TOKEN.price,
          chain: "gorrillazz",
          logo: "/gorr-logo.png",
        },
        {
          symbol: "USDCc",
          name: "USD Coin Custom",
          balance: usdccBalance.toString(),
          price: USDCC_TOKEN.price,
          value: usdccBalance * USDCC_TOKEN.price,
          chain: "gorrillazz",
          logo: "/usdcc-logo.png",
        },
        {
          symbol: chain === "ethereum" ? "ETH" : chain === "bnb" ? "BNB" : "SOL",
          name: chain === "ethereum" ? "Ethereum" : chain === "bnb" ? "BNB" : "Solana",
          balance: nativeBalance.toString(),
          price: nativePrice,
          value: nativeBalance * nativePrice,
          chain: chain || "ethereum",
          logo:
            chain === "ethereum"
              ? "https://cryptologos.cc/logos/ethereum-eth-logo.png"
              : chain === "bnb"
                ? "https://cryptologos.cc/logos/bnb-bnb-logo.png"
                : "https://cryptologos.cc/logos/solana-sol-logo.png",
        },
      ],
      totalValue: gorrBalance * GORR_TOKEN.price + usdccBalance * USDCC_TOKEN.price + nativeBalance * nativePrice,
    }

    return NextResponse.json(balances)
  } catch (error) {
    console.error("[v0] Balance fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 })
  }
}
