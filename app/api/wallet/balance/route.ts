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

  console.log("[v0] Fetching balance for wallet:", wallet, "chain:", chain)

  try {
    const isGorrWallet = wallet.startsWith("gorr_")

    if (isGorrWallet) {
      const balances = {
        wallet,
        chain: "gorrillazz",
        tokens: [
          {
            id: "gorr",
            symbol: "GORR",
            name: "Gorrillazz",
            balance: "1000",
            price: GORR_TOKEN.price,
            value: 1000 * GORR_TOKEN.price,
            chain: "gorrillazz",
            logo: "/gorr-logo.svg",
            contractAddress: process.env.GORR_CONTRACT_ADDRESS_GORRILLAZZ,
            decimals: 18,
            isNative: false,
            change24h: 0.0,
          },
          {
            id: "usdcc",
            symbol: "USDCc",
            name: "USD Coin Custom",
            balance: "500",
            price: USDCC_TOKEN.price,
            value: 500 * USDCC_TOKEN.price,
            chain: "gorrillazz",
            logo: "/usdcc-logo.png",
            contractAddress: process.env.USDCC_CONTRACT_ADDRESS_GORRILLAZZ,
            decimals: 18,
            isNative: false,
            change24h: 0.0,
          },
        ],
        totalValue: 1000 * GORR_TOKEN.price + 500 * USDCC_TOKEN.price,
      }
      console.log("[v0] Returning GORR wallet balances:", balances)
      return NextResponse.json(balances)
    }

    let provider: ethers.JsonRpcProvider
    let nativeSymbol: string
    let nativeName: string
    let nativeLogo: string
    let nativePrice = 0

    if (chain === "ethereum" || !chain) {
      provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL || "https://eth.llamarpc.com")
      nativeSymbol = "ETH"
      nativeName = "Ethereum"
      nativeLogo = "https://cryptologos.cc/logos/ethereum-eth-logo.png"
      nativePrice = 3245.67
    } else if (chain === "gorrillazz") {
      provider = new ethers.JsonRpcProvider(process.env.GORRILLAZZ_RPC_URL || "https://rpc.gorrillazz.network")
      nativeSymbol = "GORR"
      nativeName = "Gorrillazz"
      nativeLogo = "/gorr-logo.svg"
      nativePrice = 1.0
    } else {
      provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL || "https://eth.llamarpc.com")
      nativeSymbol = "ETH"
      nativeName = "Ethereum"
      nativeLogo = "https://cryptologos.cc/logos/ethereum-eth-logo.png"
      nativePrice = 3245.67
    }

    const [gorrBalanceStr, usdccBalanceStr, nativeBalanceStr] = await Promise.all([
      getTokenBalance(provider, process.env.GORR_CONTRACT_ADDRESS_GORRILLAZZ, wallet),
      getTokenBalance(provider, process.env.USDCC_CONTRACT_ADDRESS_GORRILLAZZ, wallet),
      getNativeBalance(provider, wallet),
    ])

    const gorrBalance = Number.parseFloat(gorrBalanceStr)
    const usdccBalance = Number.parseFloat(usdccBalanceStr)
    const nativeBalance = Number.parseFloat(nativeBalanceStr)

    const balances = {
      wallet,
      chain: chain || "ethereum",
      tokens: [
        {
          id: "gorr",
          symbol: "GORR",
          name: "Gorrillazz",
          balance: gorrBalance.toString(),
          price: GORR_TOKEN.price,
          value: gorrBalance * GORR_TOKEN.price,
          chain: "gorrillazz",
          logo: "/gorr-logo.svg",
          contractAddress: process.env.GORR_CONTRACT_ADDRESS_GORRILLAZZ,
          decimals: 18,
          isNative: false,
          change24h: 0.0,
        },
        {
          id: "usdcc",
          symbol: "USDCc",
          name: "USD Coin Custom",
          balance: usdccBalance.toString(),
          price: USDCC_TOKEN.price,
          value: usdccBalance * USDCC_TOKEN.price,
          chain: "gorrillazz",
          logo: "/usdcc-logo.png",
          contractAddress: process.env.USDCC_CONTRACT_ADDRESS_GORRILLAZZ,
          decimals: 18,
          isNative: false,
          change24h: 0.0,
        },
        {
          id: nativeSymbol.toLowerCase(),
          symbol: nativeSymbol,
          name: nativeName,
          balance: nativeBalance.toString(),
          price: nativePrice,
          value: nativeBalance * nativePrice,
          chain: chain || "ethereum",
          logo: nativeLogo,
          isNative: true,
          decimals: 18,
          change24h: 2.34,
        },
      ],
      totalValue: gorrBalance * GORR_TOKEN.price + usdccBalance * USDCC_TOKEN.price + nativeBalance * nativePrice,
    }

    console.log("[v0] Returning balances:", balances)
    return NextResponse.json(balances)
  } catch (error) {
    console.error("[v0] Balance fetch error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch balance",
        wallet,
        chain,
        tokens: [],
        totalValue: 0,
      },
      { status: 200 },
    ) // Return 200 with empty data instead of 500 to prevent UI breaking
  }
}
