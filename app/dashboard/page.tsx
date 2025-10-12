"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import ShaderBackground from "@/components/shader-background"
import { Navigation } from "@/components/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/lib/wallet-context"
import { apiClient } from "@/lib/api-client"
import { Coins, TrendingUp, Droplets, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

interface Token {
  id: string
  name: string
  symbol: string
  networks: string[]
  status: string
  contractAddress?: string
  createdAt: string
}

export default function DashboardPage() {
  const { address, isConnected } = useWallet()
  const [tokens, setTokens] = useState<Token[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isConnected && address) {
      loadTokens()
    }
  }, [isConnected, address])

  const loadTokens = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getTokens(address!)
      setTokens(response.tokens)
    } catch (error) {
      console.error("Failed to load tokens:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "deployed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "deploying":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  if (!isConnected) {
    return (
      <ShaderBackground>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center px-6">
          <GlassCard className="p-12 text-center max-w-md">
            <h2 className="text-3xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">Please connect your wallet to view your dashboard</p>
          </GlassCard>
        </div>
      </ShaderBackground>
    )
  }

  return (
    <ShaderBackground>
      <Navigation />

      <div className="min-h-screen pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Dashboard</h1>
            <p className="text-xl text-muted-foreground">Manage your tokens and liquidity pools</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Total Tokens</span>
              </div>
              <div className="text-3xl font-bold">{tokens.length}</div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-sm text-muted-foreground">Deployed</span>
              </div>
              <div className="text-3xl font-bold">{tokens.filter((t) => t.status === "deployed").length}</div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-sm text-muted-foreground">Total Value</span>
              </div>
              <div className="text-3xl font-bold">$0</div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-purple-500" />
                </div>
                <span className="text-sm text-muted-foreground">Liquidity Pools</span>
              </div>
              <div className="text-3xl font-bold">0</div>
            </GlassCard>
          </div>

          {/* Tokens List */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Tokens</h2>
            <Link href="/create">
              <Button className="neon-glow">
                <Coins className="w-4 h-4 mr-2" />
                Create New Token
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <GlassCard className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your tokens...</p>
            </GlassCard>
          ) : tokens.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <Coins className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">No tokens yet</h3>
              <p className="text-muted-foreground mb-6">Create your first token to get started</p>
              <Link href="/create">
                <Button className="neon-glow">Create Token</Button>
              </Link>
            </GlassCard>
          ) : (
            <div className="grid gap-4">
              {tokens.map((token, index) => (
                <motion.div
                  key={token.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 hover:glass-strong transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <span className="text-xl font-bold">{token.symbol.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{token.name}</h3>
                          <p className="text-sm text-muted-foreground">{token.symbol}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Networks</p>
                          <div className="flex gap-1">
                            {token.networks.map((network) => (
                              <span key={network} className="px-2 py-1 rounded glass-strong text-xs">
                                {network}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Status</p>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(token.status)}
                            <span className="text-sm capitalize">{token.status}</span>
                          </div>
                        </div>

                        <Button variant="outline" size="sm" className="glass bg-transparent">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ShaderBackground>
  )
}
