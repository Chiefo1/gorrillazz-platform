"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Copy, Check, ExternalLink, TrendingUp, Droplet, Lock, Users, Activity } from "lucide-react"
import Link from "next/link"

interface TokenDetails {
  id: string
  name: string
  symbol: string
  network: string
  contractAddress: string
  totalSupply: string
  decimals: number
  status: string
  createdAt: string
  description?: string
  logoUrl?: string
  website?: string
  twitter?: string
  telegram?: string
  price?: number
  marketCap?: number
  holders?: number
  liquidityPool?: {
    poolAddress: string
    locked: boolean
    lockedUntil?: string
  }
}

export default function TokenDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [token, setToken] = useState<TokenDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  useEffect(() => {
    fetchTokenDetails()
  }, [params.id])

  const fetchTokenDetails = async () => {
    try {
      // Mock token details - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockToken: TokenDetails = {
        id: params.id as string,
        name: "Gorilla Gold",
        symbol: "GGOLD",
        network: "solana",
        contractAddress: "Sol7x8y9z0a1b2c3d4e5f6",
        totalSupply: "1000000",
        decimals: 9,
        status: "deployed",
        createdAt: new Date().toISOString(),
        description: "A premium token for the Gorrillazz ecosystem",
        price: 0.5,
        marketCap: 500000,
        holders: 1234,
        liquidityPool: {
          poolAddress: "Pool1a2b3c4d5e6f7g8h9i0",
          locked: true,
          lockedUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        },
      }

      setToken(mockToken)
    } catch (error) {
      console.error("[v0] Failed to fetch token details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr)
    setCopiedAddress(addr)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading token details...</p>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Token not found</p>
          <Link href="/dashboard">
            <Button variant="outline" className="glass border-white/20 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/dashboard">
            <Button variant="outline" className="glass border-white/20 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </motion.div>

        {/* Token Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl glass-strong flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">{token.symbol.charAt(0)}</span>
              </div>
              <div className="space-y-3">
                <div>
                  <h1 className="text-4xl font-bold text-foreground">{token.name}</h1>
                  <p className="text-xl text-muted-foreground">{token.symbol}</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full glass-strong text-sm text-foreground capitalize">
                    {token.network}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm">{token.status}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                  <span>{token.contractAddress}</span>
                  <button
                    onClick={() => copyAddress(token.contractAddress)}
                    className="hover:text-foreground transition-colors"
                  >
                    {copiedAddress === token.contractAddress ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button className="hover:text-foreground transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <p className="text-sm text-muted-foreground">Current Price</p>
              <p className="text-3xl font-bold text-foreground">${token.price?.toFixed(4)}</p>
              <p className="text-sm text-green-500">+12.5% (24h)</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="glass p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Market Cap</span>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">${token.marketCap?.toLocaleString()}</p>
          </Card>

          <Card className="glass p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Total Supply</span>
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{Number(token.totalSupply).toLocaleString()}</p>
          </Card>

          <Card className="glass p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Holders</span>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{token.holders?.toLocaleString()}</p>
          </Card>

          <Card className="glass p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Liquidity</span>
              <Droplet className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {token.liquidityPool?.locked ? <Lock className="w-6 h-6 text-green-500" /> : "None"}
            </p>
          </Card>
        </motion.div>

        {/* Description & Liquidity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass p-6 space-y-4 h-full">
              <h2 className="text-xl font-bold text-foreground">About</h2>
              <p className="text-muted-foreground">{token.description || "No description available"}</p>
              <div className="space-y-3 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Decimals</span>
                  <span className="text-foreground font-semibold">{token.decimals}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground font-semibold">
                    {new Date(token.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>

          {token.liquidityPool && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="glass p-6 space-y-4 h-full">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">Liquidity Pool</h2>
                  {token.liquidityPool.locked && <Lock className="w-5 h-5 text-green-500" />}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pool Address</span>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-mono text-xs">
                        {token.liquidityPool.poolAddress.slice(0, 8)}...
                      </span>
                      <button
                        onClick={() => copyAddress(token.liquidityPool!.poolAddress)}
                        className="hover:text-foreground transition-colors"
                      >
                        {copiedAddress === token.liquidityPool.poolAddress ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-foreground font-semibold">
                      {token.liquidityPool.locked ? "Locked" : "Unlocked"}
                    </span>
                  </div>
                  {token.liquidityPool.lockedUntil && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Locked Until</span>
                      <span className="text-foreground font-semibold">
                        {new Date(token.liquidityPool.lockedUntil).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 mt-4">
                  <Droplet className="w-4 h-4 mr-2" />
                  Manage Liquidity
                </Button>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
