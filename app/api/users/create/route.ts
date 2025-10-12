import { type NextRequest, NextResponse } from "next/server"
import { getCollection, Collections, type UserDocument } from "@/lib/db-mongo"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress, email, username } = body

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    const usersCollection = await getCollection(Collections.USERS)

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ walletAddress })
    if (existingUser) {
      return NextResponse.json({
        user: {
          id: existingUser._id?.toString(),
          walletAddress: existingUser.walletAddress,
          email: existingUser.email,
          username: existingUser.username,
          gorrBalance: existingUser.gorrBalance,
        },
      })
    }

    // Create new user
    const userDoc: UserDocument = {
      walletAddress,
      email,
      username,
      gorrBalance: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await usersCollection.insertOne(userDoc)

    return NextResponse.json({
      user: {
        id: result.insertedId.toString(),
        walletAddress,
        email,
        username,
        gorrBalance: 0,
      },
    })
  } catch (error) {
    console.error("[v0] User creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
