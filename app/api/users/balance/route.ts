import { NextResponse } from "next/server"
import { ethers } from "ethers"
import { GORR_TOKEN, USDCC_TOKEN } from "@/lib/constants/gorr-token"

// --- ERC20 ABI ---
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
]

// --- Utility helpers ---
function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

function isSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
}

async function getTokenBalance(
  provider: ethers.JsonRpcProvider,
  tokenAddress: string | undefined,
  walletAddress: string,
): Promise<string> {
  try {
    if (!tokenAddress || !isValidEthereumAddress(tokenAddress)) return "0"
    if (!isValidEthereumAddress(walletAddress)) return "0"

    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
    const balance = await contract.balanceOf(walletAddress)
    const decimals = await contract.decimals()
    return ethers.formatUnits(balance, decimals)
  } catch {
    return "0"
  }
}

async function getNativeBalance(provider: ethers.JsonRpcProvider, walletAddress: string): Promise<string> {
  try {
    if (!isValidEthereumAddress(walletAddress)) return "0"
    const balance = await provider.getBalance(walletAddress)
    return ethers.formatEther(balance)
  } catch {
    return "0"
  }
}

// --- Core unified balance fetcher (used by both APIs) ---
async function getUnifiedBalance(wallet: string) {
  // === CASE 1: Gorrillazz mock wallet ===
  if (wallet.startsWith("gorr_")) {
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
    return balances
  }

  // === CASE 2: Ethereum or BNB (EVM-based) ===
  if (isValidEthereumAddress(wallet)) {
    try {
      const chainGuess = wallet.toLowerCase().startsWith("0x") ? "ethereum" : "bnb"
      const rpcUrl =
        chainGuess === "bnb"
          ? process.env.BNB_RPC_URL || "https://bsc-dataseed.binance.org"
          : process.env.ETHEREUM_RPC_URL || "https://eth.llamarpc.com"

      const provider = new ethers.JsonRpcProvider(rpcUrl)

      const [gorrBalanceStr, usdccBalanceStr, nativeBalanceStr] = await Promise.all([
        getTokenBalance(provider, process.env.GORR_CONTRACT_ADDRESS_GORRILLAZZ, wallet),
        getTokenBalance(provider, process.env.USDCC_CONTRACT_ADDRESS_GORRILLAZZ, wallet),
        getNativeBalance(provider, wallet),
      ])

      const gorrBalance = Number.parseFloat(gorrBalanceStr)
      const usdccBalance = Number.parseFloat(usdccBalanceStr)
      const nativeBalance = Number.parseFloat(nativeBalanceStr)

      const nativeSymbol = chainGuess === "bnb" ? "BNB" : "ETH"
      const nativeName = chainGuess === "bnb" ? "Binance Coin" : "Ethereum"
      const nativePrice = chainGuess === "bnb" ? 585.43 : 3245.67
      const nativeLogo =
        chainGuess === "bnb"
          ? "https://cryptologos.cc/logos/bnb-bnb-logo.png"
          : "https://cryptologos.cc/logos/ethereum-eth-logo.png"

      const balances = {
        wallet,
        chain: chainGuess,
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
            chain: chainGuess,
            logo: nativeLogo,
            isNative: true,
            decimals: 18,
            change24h: 2.34,
          },
        ],
        totalValue:
          gorrBalance * GORR_TOKEN.price +
          usdccBalance * USDCC_TOKEN.price +
          nativeBalance * nativePrice,
      }
      return balances
    } catch (error) {
      console.error("[v0] EVM balance fetch error:", error)
      return { wallet, chain: "ethereum", tokens: [], totalValue: 0 }
    }
  }

  // === CASE 3: Solana ===
  if (isSolanaAddress(wallet)) {
    return {
      wallet,
      chain: "solana",
      tokens: [
        {
          id: "sol",
          symbol: "SOL",
          name: "Solana",
          balance: "2.34",
          price: 165.42,
          value: 2.34 * 165.42,
          chain: "solana",
          logo: "https://cryptologos.cc/logos/solana-sol-logo.png",
          isNative: true,
          decimals: 9,
          change24h: 1.25,
        },
      ],
      totalValue: 2.34 * 165.42,
    }
  }

  // === Fallback ===
  return { wallet, chain: "unknown", tokens: [], totalValue: 0 }
}

// --- Route handler ---
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get("wallet")

  if (!wallet) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
  }

  try {
    console.log("[v0] /api/users/balance auto-detecting wallet:", wallet)
    const balances = await getUnifiedBalance(wallet)
    return NextResponse.json(balances)
  } catch (error) {
    console.error("[v0] /api/users/balance error:", error)
    return NextResponse.json({ wallet, chain: "unknown", tokens: [], totalValue: 0 })
  }
}
