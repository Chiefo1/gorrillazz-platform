import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { LiquidityManager } from "@/lib/blockchain/liquidity-manager"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pool = await prisma.liquidityPool.findUnique({
      where: { id: params.id },
      include: {
        token: {
          include: {
            creator: true,
          },
        },
      },
    })

    if (!pool) {
      return NextResponse.json({ error: "Pool not found" }, { status: 404 })
    }

    // Get pool stats if pool is active
    let stats = null
    if (pool.status === "active" && pool.poolAddress) {
      const liquidityManager = new LiquidityManager()
      stats = await liquidityManager.getPoolStats(pool.poolAddress)
    }

    return NextResponse.json({ pool, stats })
  } catch (error) {
    console.error("Error fetching pool:", error)
    return NextResponse.json({ error: "Failed to fetch pool" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, poolAddress } = body

    const pool = await prisma.liquidityPool.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(poolAddress && { poolAddress }),
      },
    })

    return NextResponse.json({ pool, success: true })
  } catch (error) {
    console.error("Error updating pool:", error)
    return NextResponse.json({ error: "Failed to update pool" }, { status: 500 })
  }
}
