import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("walletAddress")
    const status = searchParams.get("status")

    const where: any = {}
    if (walletAddress) {
      where.creator = { walletAddress }
    }
    if (status) {
      where.status = status
    }

    const tokens = await prisma.token.findMany({
      where,
      include: {
        creator: true,
        liquidityPools: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ tokens })
  } catch (error) {
    console.error("Error fetching tokens:", error)
    return NextResponse.json({ error: "Failed to fetch tokens" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress, walletType, tokenData } = body

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress,
          walletType,
        },
      })
    }

    // Create token
    const token = await prisma.token.create({
      data: {
        name: tokenData.name,
        symbol: tokenData.symbol,
        decimals: Number.parseInt(tokenData.decimals),
        totalSupply: tokenData.totalSupply,
        description: tokenData.description,
        logoUrl: tokenData.logoUrl,
        networks: tokenData.networks,
        creatorId: user.id,
        status: "pending",
      },
    })

    // Create liquidity pool if specified
    if (tokenData.liquidityOption !== "none" && tokenData.liquidityAmount) {
      await prisma.liquidityPool.create({
        data: {
          tokenId: token.id,
          network: tokenData.networks[0],
          dexPlatform: tokenData.liquidityOption === "own" ? "gorrillazz" : tokenData.dexPlatform,
          liquidityAmount: tokenData.liquidityAmount,
          status: "pending",
        },
      })
    }

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId: user.id,
        tokenId: token.id,
        type: "deploy",
        network: tokenData.networks[0],
        status: "pending",
        fee: "50", // Platform fee in GORR
      },
    })

    return NextResponse.json({ token, success: true })
  } catch (error) {
    console.error("Error creating token:", error)
    return NextResponse.json({ error: "Failed to create token" }, { status: 500 })
  }
}
