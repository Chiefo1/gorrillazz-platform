import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await prisma.token.findUnique({
      where: { id: params.id },
      include: {
        creator: true,
        liquidityPools: true,
        transactions: true,
      },
    })

    if (!token) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 })
    }

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Error fetching token:", error)
    return NextResponse.json({ error: "Failed to fetch token" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, contractAddress, metadataUri } = body

    const token = await prisma.token.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(contractAddress && { contractAddress }),
        ...(metadataUri && { metadataUri }),
      },
    })

    return NextResponse.json({ token, success: true })
  } catch (error) {
    console.error("Error updating token:", error)
    return NextResponse.json({ error: "Failed to update token" }, { status: 500 })
  }
}
