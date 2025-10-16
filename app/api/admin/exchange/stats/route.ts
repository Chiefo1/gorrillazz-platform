import { NextResponse } from "next/server"
import { getExchangeStats } from "@/lib/exchange"

export async function GET() {
  try {
    const stats = await getExchangeStats()

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch stats",
      },
      { status: 500 },
    )
  }
}
