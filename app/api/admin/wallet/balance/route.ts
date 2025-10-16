import { NextResponse } from "next/server"
import { getAdminWalletBalance } from "@/lib/admin-wallet"

export async function GET() {
  try {
    const balance = await getAdminWalletBalance()

    return NextResponse.json({
      success: true,
      balance,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch balance",
      },
      { status: 500 },
    )
  }
}
