"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import ShaderBackground from "@/components/shader-background"
import { Navigation } from "@/components/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWallet } from "@/lib/wallet-context"
import { apiClient } from "@/lib/api-client"
import { Droplets, Plus, TrendingUp, ArrowUpDown, Loader2, Search, Filter, ExternalLink } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface LiquidityPool {
  id: string
  token: {
    name: string
    symbol: string
  }
  network: string
  dexPlatform: string
  liquidityAmount: string
  pairToken: string
  status: string
  poolAddress?: string
  createdAt: string
}

export default function LiquidityPage() {
  const { address, isConnected } = useWallet()
  const [pools, setPools] = useState<LiquidityPool[]>([])
  const [tokens, setTokens] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [networkFilter, setNetworkFilter] = useState("all")
  const [isAddingLiquidity, setIsAddingLiquidity] = useState(false)

  // Add liquidity form state
  const [selectedToken, setSelectedToken] = useState("")
  const [selectedNetwork, setSelectedNetwork] = useState("")
  const [selectedDex, setSelectedDex] = useState("gorrillazz")
  const [liquidityAmount, setLiquidityAmount] = useState("")

  useEffect(() => {
    if (isConnected && address) {
      loadData()
    }
  }, [isConnected, address])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [poolsResponse, tokensResponse] = await Promise.all([
        apiClient.getLiquidityPools(),
        apiClient.getTokens(address!),
      ])
      setPools(poolsResponse.pools)
      setTokens(tokensResponse.tokens.filter((t: any) => t.status === "deployed"))
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddLiquidity = async () => {
    if (!selectedToken || !selectedNetwork || !liquidityAmount) {
      alert("Please fill in all fields")
      return
    }

    setIsAddingLiquidity(true)
    try {
      await apiClient.createLiquidityPool({
        tokenId: selectedToken,
        network: selectedNetwork,
        dexPlatform: selectedDex,
        liquidityAmount,
      })
      await loadData()
      // Reset form
      setSelectedToken("")
      setSelectedNetwork("")
      setLiquidityAmount("")
    } catch (error) {
      console.error("Failed to add liquidity:", error)
      alert("Failed to add liquidity. Please try again.")
    } finally {
      setIsAddingLiquidity(false)
    }
  }

  const filteredPools = pools.filter((pool) => {
    const matchesSearch =
      pool.token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesNetwork = networkFilter === "all" || pool.network === networkFilter
    return matchesSearch && matchesNetwork
  })

  const totalLiquidity = pools.reduce((sum, pool) => sum + Number.parseFloat(pool.liquidityAmount), 0)

  if (!isConnected) {
    return (
      <ShaderBackground>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center px-6">
          <GlassCard className="p-12 text-center max-w-md">
            <h2 className="text-3xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">Please connect your wallet to manage liquidity pools</p>
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Liquidity Pools</h1>
            <p className="text-xl text-muted-foreground">Manage liquidity across multiple DEXs and networks</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-sm text-muted-foreground">Total Pools</span>
              </div>
              <div className="text-3xl font-bold">{pools.length}</div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-sm text-muted-foreground">Total Liquidity</span>
              </div>
              <div className="text-3xl font-bold">{totalLiquidity.toFixed(2)} GORR</div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <ArrowUpDown className="w-5 h-5 text-purple-500" />
                </div>
                <span className="text-sm text-muted-foreground">Active Pools</span>
              </div>
              <div className="text-3xl font-bold">{pools.filter((p) => p.status === "active").length}</div>
            </GlassCard>
          </div>

          {/* Filters and Add Button */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search pools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass pl-10"
              />
            </div>

            <Select value={networkFilter} onValueChange={setNetworkFilter}>
              <SelectTrigger className="glass w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Networks</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="bnb">BNB Chain</SelectItem>
                <SelectItem value="gorrillazz">Gorrillazz</SelectItem>
              </SelectContent>
            </Select>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="neon-glow">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Liquidity
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-strong border-border">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Add Liquidity</DialogTitle>
                  <DialogDescription>Create a new liquidity pool for your token</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <Label>Select Token</Label>
                    <Select value={selectedToken} onValueChange={setSelectedToken}>
                      <SelectTrigger className="glass">
                        <SelectValue placeholder="Choose a token" />
                      </SelectTrigger>
                      <SelectContent>
                        {tokens.map((token) => (
                          <SelectItem key={token.id} value={token.id}>
                            {token.name} ({token.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Network</Label>
                    <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                      <SelectTrigger className="glass">
                        <SelectValue placeholder="Choose network" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solana">Solana</SelectItem>
                        <SelectItem value="ethereum">Ethereum</SelectItem>
                        <SelectItem value="bnb">BNB Chain</SelectItem>
                        <SelectItem value="gorrillazz">Gorrillazz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>DEX Platform</Label>
                    <Select value={selectedDex} onValueChange={setSelectedDex}>
                      <SelectTrigger className="glass">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gorrillazz">Gorrillazz DEX</SelectItem>
                        <SelectItem value="uniswap">Uniswap</SelectItem>
                        <SelectItem value="pancakeswap">PancakeSwap</SelectItem>
                        <SelectItem value="raydium">Raydium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Liquidity Amount (GORR)</Label>
                    <Input
                      type="number"
                      placeholder="1000"
                      value={liquidityAmount}
                      onChange={(e) => setLiquidityAmount(e.target.value)}
                      className="glass"
                    />
                  </div>

                  <Button onClick={handleAddLiquidity} disabled={isAddingLiquidity} className="w-full neon-glow">
                    {isAddingLiquidity ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding Liquidity...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Liquidity
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Pools List */}
          {isLoading ? (
            <GlassCard className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading liquidity pools...</p>
            </GlassCard>
          ) : filteredPools.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <Droplets className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">No liquidity pools found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || networkFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Add liquidity to your tokens to get started"}
              </p>
            </GlassCard>
          ) : (
            <div className="grid gap-4">
              {filteredPools.map((pool, index) => (
                <motion.div
                  key={pool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 hover:glass-strong transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <Droplets className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">
                            {pool.token.symbol} / {pool.pairToken}
                          </h3>
                          <p className="text-sm text-muted-foreground">{pool.token.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Network</p>
                          <span className="px-3 py-1 rounded-full glass-strong text-sm capitalize">{pool.network}</span>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-1">DEX</p>
                          <span className="text-sm font-medium capitalize">{pool.dexPlatform}</span>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Liquidity</p>
                          <span className="text-sm font-bold">{pool.liquidityAmount} GORR</span>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Status</p>
                          <span
                            className={`text-sm font-medium capitalize ${
                              pool.status === "active" ? "text-green-500" : "text-yellow-500"
                            }`}
                          >
                            {pool.status}
                          </span>
                        </div>

                        <Button variant="outline" size="sm" className="glass bg-transparent">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Pool
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
