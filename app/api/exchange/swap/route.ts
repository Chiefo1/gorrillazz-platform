import { NextResponse } from "next/server"
import { executeSwap } from "@/lib/exchange"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { fromToken, toToken, amount, userAddress } = await request.json()

    if (!fromToken || !toToken || !amount || !userAddress) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const result = await executeSwap(fromToken, toToken, amount, userAddress)

    if (result.success) {
      // Record swap transaction
      await prisma.transaction.create({
        data: {
          userId: userAddress,
          type: "swap",
          amount: amount.toString(),
          fromAddress: userAddress,
          toAddress: userAddress,
          network: "gorrillazz",
          status: "confirmed",
          txHash: result.txHash,
        },
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Swap failed",
      },
      { status: 500 },
    )
  }
}
