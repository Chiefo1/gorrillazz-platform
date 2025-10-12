import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("walletAddress")

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    let balance = await prisma.gorrBalance.findUnique({
      where: { walletAddress },
    })

    if (!balance) {
      balance = await prisma.gorrBalance.create({
        data: {
          walletAddress,
          balance: "0",
          lockedBalance: "0",
        },
      })
    }

    return NextResponse.json({ balance })
  } catch (error) {
    console.error("Error fetching balance:", error)
    return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress, amount, operation } = body

    const balance = await prisma.gorrBalance.upsert({
      where: { walletAddress },
      update: {
        balance: operation === "add" ? { increment: amount } : { decrement: amount },
      },
      create: {
        walletAddress,
        balance: amount,
      },
    })

    return NextResponse.json({ balance, success: true })
  } catch (error) {
    console.error("Error updating balance:", error)
    return NextResponse.json({ error: "Failed to update balance" }, { status: 500 })
  }
}
