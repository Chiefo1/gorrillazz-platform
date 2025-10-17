import { NextResponse } from "next/server"
import { adminWithdraw } from "@/lib/admin-wallet"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { token, amount, destination, provider, currency } = await request.json()

    if (!token || !amount || !destination || !provider || !currency) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const adminWalletAddress = process.env.ADMIN_WALLET_ADDRESS || "gorr_admin_wallet_2024"

    let adminUser = await prisma.user.findUnique({
      where: { walletAddress: adminWalletAddress },
    })

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          walletAddress: adminWalletAddress,
          username: "admin",
          email: "admin@gorrillazz.app",
        },
      })
    }

    const result = await adminWithdraw(token, amount, destination, provider, currency)

    if (result.success) {
      // Record transaction in database
      await prisma.transaction.create({
        data: {
          userId: adminUser.id,
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
    console.error("[v0] Admin withdrawal error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Withdrawal failed",
      },
      { status: 500 },
    )
  }
}
