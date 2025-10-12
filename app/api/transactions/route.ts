import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("walletAddress")
    const tokenId = searchParams.get("tokenId")
    const type = searchParams.get("type")

    const where: any = {}
    if (walletAddress) {
      where.user = { walletAddress }
    }
    if (tokenId) {
      where.tokenId = tokenId
    }
    if (type) {
      where.type = type
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        user: true,
        token: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    })

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
