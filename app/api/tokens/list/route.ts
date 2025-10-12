import { type NextRequest, NextResponse } from "next/server"
import { getCollection, Collections } from "@/lib/db-mongo"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("wallet")

    const tokensCollection = await getCollection(Collections.TOKENS)

    const query = walletAddress ? { creatorId: walletAddress } : {}
    const tokens = await tokensCollection.find(query).sort({ createdAt: -1 }).limit(100).toArray()

    // Transform MongoDB documents to API response format
    const formattedTokens = tokens.map((token) => ({
      id: token._id?.toString(),
      name: token.name,
      symbol: token.symbol,
      network: token.network,
      contractAddress: token.contractAddress,
      totalSupply: token.totalSupply,
      logoUrl: token.logoUrl,
      status: token.status,
      createdAt: token.createdAt.toISOString(),
    }))

    return NextResponse.json({
      tokens: formattedTokens,
    })
  } catch (error) {
    console.error("[v0] Token list error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
