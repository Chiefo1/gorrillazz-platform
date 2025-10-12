import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { DeploymentManager } from "@/lib/blockchain/deployment-manager"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tokenId, walletAddress } = body

    // Fetch token from database
    const token = await prisma.token.findUnique({
      where: { id: tokenId },
      include: { creator: true },
    })

    if (!token) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 })
    }

    // Update token status to deploying
    await prisma.token.update({
      where: { id: tokenId },
      data: { status: "deploying" },
    })

    // Deploy to selected networks
    const deploymentManager = new DeploymentManager()
    const deploymentConfig = {
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      totalSupply: token.totalSupply,
      description: token.description || "",
      metadataUri: token.metadataUri || "",
      networks: token.networks,
    }

    const results = await deploymentManager.deployToMultipleNetworks(deploymentConfig, walletAddress)

    // Update token with deployment results
    const successfulDeployments = results.filter((r) => r.status === "success")
    if (successfulDeployments.length > 0) {
      // Store the first successful contract address
      await prisma.token.update({
        where: { id: tokenId },
        data: {
          status: "deployed",
          contractAddress: successfulDeployments[0].contractAddress,
        },
      })

      // Create transaction records for each deployment
      for (const result of results) {
        await prisma.transaction.create({
          data: {
            userId: token.creatorId,
            tokenId: token.id,
            type: "deploy",
            network: result.network,
            txHash: result.txHash,
            status: result.status === "success" ? "confirmed" : "failed",
            metadata: result,
          },
        })
      }
    } else {
      await prisma.token.update({
        where: { id: tokenId },
        data: { status: "failed" },
      })
    }

    return NextResponse.json({ results, success: true })
  } catch (error) {
    console.error("[v0] Deployment error:", error)
    return NextResponse.json({ error: "Deployment failed" }, { status: 500 })
  }
}
