import { NextResponse } from "next/server"
import { adminWithdraw } from "@/lib/admin-wallet"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { token, amount, destination, provider, currency } = await request.json()

    if (!token || !amount || !destination || !provider || !currency) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const result = await adminWithdraw(token, amount, destination, provider, currency)

    if (result.success) {
      // Record transaction in database
      await prisma.transaction.create({
        data: {
          userId: "admin",
          type: "withdrawal",
          amount: amount.toString(),
          toAddress: destination,
          network: "gorrillazz",
          status: "confirmed",
          paymentProvider: provider,
          paymentMethod: "withdrawal",
          fiatAmount: amount,
          fiatCurrency: currency,
          fee: 0, // Admin withdrawals are fee-free
          netAmount: amount,
          txHash: result.txId,
        },
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Withdrawal failed",
      },
      { status: 500 },
    )
  }
}
