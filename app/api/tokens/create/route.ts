import { type NextRequest, NextResponse } from "next/server"
import { deploySolanaToken, createSolanaLiquidityPool } from "@/lib/blockchain/solana"
import { deployEthereumToken, createEthereumLiquidityPool } from "@/lib/blockchain/ethereum"
import { deployGorrillazzToken, createGorrillazzLiquidityPool } from "@/lib/blockchain/gorrillazz"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tokenData, walletAddress } = body

    console.log("[v0] Token creation request:", tokenData)

    // Validate required fields
    if (!tokenData.name || !tokenData.symbol || !tokenData.totalSupply || !tokenData.network) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet not connected" }, { status: 401 })
    }

    // Deploy token based on network
    let deployResult
    let poolResult

    switch (tokenData.network) {
      case "gorrillazz":
        deployResult = await deployGorrillazzToken(
          {
            name: tokenData.name,
            symbol: tokenData.symbol,
            decimals: tokenData.decimals || 18,
            totalSupply: tokenData.totalSupply,
            logoUrl: tokenData.logoUrl,
          },
          walletAddress,
        )

        if (deployResult.success && tokenData.liquidityAmount && deployResult.contractAddress) {
          poolResult = await createGorrillazzLiquidityPool(
            deployResult.contractAddress,
            tokenData.liquidityAmount,
            tokenData.lockPeriod || 0,
          )
        }
        break

      case "ethereum":
      case "bnb":
        deployResult = await deployEthereumToken(
          {
            name: tokenData.name,
            symbol: tokenData.symbol,
            decimals: tokenData.decimals || 18,
            totalSupply: tokenData.totalSupply,
            logoUrl: tokenData.logoUrl,
            mintable: tokenData.mintable,
            burnable: tokenData.burnable,
            pausable: tokenData.pausable,
          },
          walletAddress,
          tokenData.network,
        )

        if (deployResult.success && tokenData.liquidityAmount && deployResult.contractAddress) {
          poolResult = await createEthereumLiquidityPool(
            deployResult.contractAddress,
            tokenData.liquidityAmount,
            tokenData.lockPeriod || 0,
            tokenData.network,
          )
        }
        break

      case "solana":
        deployResult = await deploySolanaToken(
          {
            name: tokenData.name,
            symbol: tokenData.symbol,
            decimals: tokenData.decimals || 9,
            totalSupply: tokenData.totalSupply,
            logoUrl: tokenData.logoUrl,
          },
          walletAddress,
        )

        if (deployResult.success && tokenData.liquidityAmount && deployResult.contractAddress) {
          poolResult = await createSolanaLiquidityPool(
            deployResult.contractAddress,
            tokenData.liquidityAmount,
            tokenData.lockPeriod || 0,
          )
        }
        break

      default:
        return NextResponse.json({ error: "Unsupported network" }, { status: 400 })
    }

    if (!deployResult.success) {
      return NextResponse.json({ error: deployResult.error || "Token deployment failed" }, { status: 500 })
    }

    const tokensCollection = await getCollection(Collections.TOKENS)
    const tokenDoc: TokenDocument = {
      name: tokenData.name,
      symbol: tokenData.symbol,
      description: tokenData.description,
      totalSupply: tokenData.totalSupply,
      decimals: tokenData.decimals || (tokenData.network === "solana" ? 9 : 18),
      logoUrl: tokenData.logoUrl,
      network: tokenData.network,
      contractAddress: deployResult.contractAddress,
      creatorId: walletAddress,
      status: "deployed",
      mintable: tokenData.mintable || false,
      burnable: tokenData.burnable || false,
      pausable: tokenData.pausable || false,
      website: tokenData.website,
      twitter: tokenData.twitter,
      telegram: tokenData.telegram,
      discord: tokenData.discord,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const tokenResult = await tokensCollection.insertOne(tokenDoc)
    const tokenId = tokenResult.insertedId.toString()

    let poolId = null
    if (poolResult?.success && poolResult.poolAddress) {
      const poolsCollection = await getCollection(Collections.LIQUIDITY_POOLS)
      const poolDoc: LiquidityPoolDocument = {
        tokenId,
        initialLiquidity: tokenData.liquidityAmount,
        lockPeriod: tokenData.lockPeriod || 0,
        lockedUntil: tokenData.lockPeriod
          ? new Date(Date.now() + tokenData.lockPeriod * 24 * 60 * 60 * 1000)
          : undefined,
        poolAddress: poolResult.poolAddress,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const poolInsertResult = await poolsCollection.insertOne(poolDoc)
      poolId = poolInsertResult.insertedId.toString()
    }

    // Return success response
    return NextResponse.json({
      success: true,
      token: {
        id: tokenId,
        contractAddress: deployResult.contractAddress,
        network: tokenData.network,
        name: tokenData.name,
        symbol: tokenData.symbol,
      },
      liquidityPool: poolResult?.success
        ? {
            id: poolId,
            poolAddress: poolResult.poolAddress,
          }
        : null,
    })
  } catch (error) {
    console.error("[v0] Token creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
