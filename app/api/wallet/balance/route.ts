import { NextResponse } from "next/server"
import { GORR_TOKEN, USDCC_TOKEN } from "@/lib/constants/gorr-token"
import { ethers } from "ethers"

// ERC20 ABI for balanceOf
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
]

function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

async function getTokenBalance(
  provider: ethers.JsonRpcProvider,
  tokenAddress: string | undefined,
  walletAddress: string,
): Promise<string> {
  try {
    if (!tokenAddress || !isValidEthereumAddress(tokenAddress)) {
      console.log("[v0] Invalid token address:", tokenAddress)
      return "0"
    }

    if (!isValidEthereumAddress(walletAddress)) {
      console.log("[v0] Invalid wallet address:", walletAddress)
      return "0"
    }

    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
    const balance = await contract.balanceOf(walletAddress)
    const decimals = await contract.decimals()
    return ethers.formatUnits(balance, decimals)
  } catch (error) {
    console.error("[v0] Token balance fetch error:", error)
    return "0"
  }
}

async function getNativeBalance(provider: ethers.JsonRpcProvider, walletAddress: string): Promise<string> {
  try {
    if (!isValidEthereumAddress(walletAddress)) {
      console.log("[v0] Invalid wallet address for native balance:", walletAddress)
      return "0"
    }

    const balance = await provider.getBalance(walletAddress)
    return ethers.formatEther(balance)
  } catch (error) {
    console.error("[v0] Native balance fetch error:", error)
    return "0"
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get("wallet")
  const chain = searchParams.get("chain")

  if (!wallet) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
  }

  try {
    const isGorrWallet = wallet.startsWith("gorr_")

    if (isGorrWallet) {
      // For GORR wallets, return mock data or fetch from GORR blockchain
      const balances = {
        wallet,
        chain: "gorrillazz",
        tokens: [
          {
            symbol: "GORR",
            name: "Gorrillazz",
            balance: "1000",
            price: GORR_TOKEN.price,
            value: 1000 * GORR_TOKEN.price,
            chain: "gorrillazz",
            logo: "/gorr-logo.svg",
          },
          {
            symbol: "USDCc",
            name: "USD Coin Custom",
            balance: "500",
            price: USDCC_TOKEN.price,
            value: 500 * USDCC_TOKEN.price,
            chain: "gorrillazz",
            logo: "/usdcc-logo.png",
          },
        ],
        totalValue: 1000 * GORR_TOKEN.price + 500 * USDCC_TOKEN.price,
      }
      return NextResponse.json(balances)
    }

    let provider: ethers.JsonRpcProvider
    let nativeSymbol: string
    let nativeName: string
    let nativeLogo: string
    let nativePrice = 0

    if (chain === "ethereum") {
      provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL || "https://eth.llamarpc.com")
      nativeSymbol = "ETH"
      nativeName = "Ethereum"
      nativeLogo = "https://cryptologos.cc/logos/ethereum-eth-logo.png"
      nativePrice = 3245.67 // TODO: Fetch from price API
    } else if (chain === "bnb") {
      provider = new ethers.JsonRpcProvider(process.env.BNB_RPC_URL || "https://bsc-dataseed.binance.org")
      nativeSymbol = "BNB"
      nativeName = "BNB"
      nativeLogo = "https://cryptologos.cc/logos/bnb-bnb-logo.png"
      nativePrice = 312.45 // TODO: Fetch from price API
    } else {
      // Default to Ethereum
      provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL || "https://eth.llamarpc.com")
      nativeSymbol = "ETH"
      nativeName = "Ethereum"
      nativeLogo = "https://cryptologos.cc/logos/ethereum-eth-logo.png"
      nativePrice = 3245.67
    }

    const [gorrBalanceStr, usdccBalanceStr, nativeBalanceStr] = await Promise.all([
      getTokenBalance(provider, GORR_TOKEN.address, wallet),
      getTokenBalance(provider, USDCC_TOKEN.address, wallet),
      getNativeBalance(provider, wallet),
    ])

    const gorrBalance = Number.parseFloat(gorrBalanceStr)
    const usdccBalance = Number.parseFloat(usdccBalanceStr)
    const nativeBalance = Number.parseFloat(nativeBalanceStr)

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
          logo: "/gorr-logo.svg",
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
          symbol: nativeSymbol,
          name: nativeName,
          balance: nativeBalance.toString(),
          price: nativePrice,
          value: nativeBalance * nativePrice,
          chain: chain || "ethereum",
          logo: nativeLogo,
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
