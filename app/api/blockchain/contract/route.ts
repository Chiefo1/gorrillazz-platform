import { type NextRequest, NextResponse } from "next/server"
import { generateERC20Contract } from "@/lib/blockchain/contracts/erc20-template"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, symbol, totalSupply, features } = body

    if (!name || !symbol || !totalSupply) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const contract = generateERC20Contract(name, symbol, totalSupply, features || {})

    return NextResponse.json({
      contract,
      language: "solidity",
    })
  } catch (error) {
    console.error("[v0] Contract generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
