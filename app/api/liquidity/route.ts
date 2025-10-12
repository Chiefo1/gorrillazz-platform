import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tokenId = searchParams.get("tokenId")
    const network = searchParams.get("network")

    const where: any = {}
    if (tokenId) {
      where.tokenId = tokenId
    }
    if (network) {
      where.network = network
    }

    const pools = await prisma.liquidityPool.findMany({
      where,
      include: {
        token: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ pools })
  } catch (error) {
    console.error("Error fetching liquidity pools:", error)
    return NextResponse.json({ error: "Failed to fetch liquidity pools" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tokenId, network, dexPlatform, liquidityAmount } = body

    const pool = await prisma.liquidityPool.create({
      data: {
        tokenId,
        network,
        dexPlatform,
        liquidityAmount,
        status: "pending",
      },
    })

    return NextResponse.json({ pool, success: true })
  } catch (error) {
    console.error("Error creating liquidity pool:", error)
    return NextResponse.json({ error: "Failed to create liquidity pool" }, { status: 500 })
  }
}
