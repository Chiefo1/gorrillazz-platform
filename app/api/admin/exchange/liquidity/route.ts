import { NextResponse } from "next/server"
import { setLiquidity } from "@/lib/exchange"

export async function POST(request: Request) {
  try {
    const { token, amount, adminAddress } = await request.json()

    if (!token || !amount || !adminAddress) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const result = await setLiquidity(token, amount, adminAddress)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to set liquidity",
      },
      { status: 500 },
    )
  }
}
