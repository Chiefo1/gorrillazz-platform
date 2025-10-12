import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js"
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import bs58 from "bs58"

export interface SolanaTokenConfig {
  name: string
  symbol: string
  decimals: number
  totalSupply: string
  logoUrl?: string
}

// Initialize Solana connection
const getSolanaConnection = () => {
  const rpcUrl = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com"
  return new Connection(rpcUrl, "confirmed")
}

// Get payer keypair from environment
const getPayerKeypair = () => {
  const privateKey = process.env.SOLANA_PRIVATE_KEY
  if (!privateKey) {
    throw new Error("SOLANA_PRIVATE_KEY not found in environment variables")
  }
  return Keypair.fromSecretKey(bs58.decode(privateKey))
}

export async function deploySolanaToken(
  config: SolanaTokenConfig,
  walletAddress: string,
): Promise<{ success: boolean; contractAddress?: string; error?: string }> {
  try {
    const connection = getSolanaConnection()
    const payer = getPayerKeypair()
    const owner = new PublicKey(walletAddress)

    console.log("[v0] Deploying Solana token:", config)

    // Create new mint
    const mint = await createMint(
      connection,
      payer,
      owner, // mint authority
      owner, // freeze authority
      config.decimals,
    )

    console.log("[v0] Mint created:", mint.toBase58())

    // Create associated token account for the owner
    const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mint, owner)

    // Mint initial supply to the owner
    const totalSupplyLamports = BigInt(config.totalSupply) * BigInt(10 ** config.decimals)
    await mintTo(connection, payer, mint, tokenAccount.address, owner, totalSupplyLamports)

    console.log("[v0] Tokens minted to:", tokenAccount.address.toBase58())

    return {
      success: true,
      contractAddress: mint.toBase58(),
    }
  } catch (error) {
    console.error("[v0] Solana deployment error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function createSolanaLiquidityPool(
  tokenAddress: string,
  amount: string,
  lockPeriod: number,
): Promise<{ success: boolean; poolAddress?: string; error?: string }> {
  try {
    const connection = getSolanaConnection()
    const payer = getPayerKeypair()

    console.log("[v0] Creating Solana liquidity pool:", { tokenAddress, amount, lockPeriod })

    // In production, integrate with Raydium or Orca for liquidity pools
    // For now, create a simple escrow account
    const poolKeypair = Keypair.generate()

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: poolKeypair.publicKey,
        lamports: LAMPORTS_PER_SOL * 0.01, // Rent exemption
        space: 165, // Account size
        programId: TOKEN_PROGRAM_ID,
      }),
    )

    await sendAndConfirmTransaction(connection, transaction, [payer, poolKeypair])

    console.log("[v0] Liquidity pool created:", poolKeypair.publicKey.toBase58())

    return {
      success: true,
      poolAddress: poolKeypair.publicKey.toBase58(),
    }
  } catch (error) {
    console.error("[v0] Solana pool creation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function getSolanaBalance(walletAddress: string): Promise<number> {
  try {
    const connection = getSolanaConnection()
    const publicKey = new PublicKey(walletAddress)
    const balance = await connection.getBalance(publicKey)
    return balance / LAMPORTS_PER_SOL
  } catch (error) {
    console.error("[v0] Error fetching Solana balance:", error)
    return 0
  }
}
