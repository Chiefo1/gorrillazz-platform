"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import GL from "@/components/gl"
import Navigation from "@/components/navigation"
import BackButton from "@/components/back-button"
import { GlassCard, GlassButton, GlassInput } from "@/components/glass"
import { motion } from "framer-motion"
import { useWallet } from "@/lib/wallet-context"

interface PendingToken {
  chainId: number
  address: string
  name: string
  symbol: string
  logoURI: string
  registrationFee?: number
  extensions?: {
    website?: string
    description?: string
  }
}

interface AdminWalletBalance {
  gorr: number
  usdcc: number
  eth: number
  bnb: number
  sol: number
}

interface ExchangeStats {
  volume24h: number
  trades24h: number
  liquidity: Array<{
    token: string
    available: number
    locked: number
    total: number
  }>
}

const ADMIN_WALLET = "gorr_admin_wallet_2024"

export default function AdminPage() {
  const router = useRouter()
  const { address, isConnected } = useWallet()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [pendingTokens, setPendingTokens] = useState<PendingToken[]>([])
  const [activeTab, setActiveTab] = useState<"tokens" | "wallet" | "exchange" | "payments">("wallet")

  // Wallet state
  const [walletBalance, setWalletBalance] = useState<AdminWalletBalance | null>(null)
  const [withdrawToken, setWithdrawToken] = useState("GORR")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawDestination, setWithdrawDestination] = useState("")
  const [withdrawProvider, setWithdrawProvider] = useState<"revolut" | "paypal">("revolut")
  const [withdrawCurrency, setWithdrawCurrency] = useState<"USD" | "EUR">("EUR")

  // Exchange state
  const [exchangeStats, setExchangeStats] = useState<ExchangeStats | null>(null)
  const [liquidityToken, setLiquidityToken] = useState("GORR")
  const [liquidityAmount, setLiquidityAmount] = useState("")

  useEffect(() => {
    if (isConnected && address === ADMIN_WALLET) {
      setIsAuthenticated(true)
    }
  }, [isConnected, address])

  useEffect(() => {
    if (isAuthenticated) {
      fetchPendingTokens()
      fetchWalletBalance()
      fetchExchangeStats()
    }
  }, [isAuthenticated])

  const fetchPendingTokens = async () => {
    try {
      const response = await fetch("/api/admin/tokens/pending")
      if (response.ok) {
        const data = await response.json()
        setPendingTokens(data.tokens)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch pending tokens:", error)
    }
  }

  const fetchWalletBalance = async () => {
    try {
      const response = await fetch("/api/admin/wallet/balance")
      if (response.ok) {
        const data = await response.json()
        setWalletBalance(data.balance)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch wallet balance:", error)
    }
  }

  const fetchExchangeStats = async () => {
    try {
      const response = await fetch("/api/admin/exchange/stats")
      if (response.ok) {
        const data = await response.json()
        setExchangeStats(data.stats)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch exchange stats:", error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        setIsAuthenticated(true)
      } else {
        setError("Invalid credentials")
      }
    } catch (error) {
      setError("Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      setIsAuthenticated(false)
      setUsername("")
      setPassword("")
    } catch (error) {
      console.error("[v0] Logout failed:", error)
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawDestination) {
      alert("Please fill in all fields")
      return
    }

    try {
      const response = await fetch("/api/admin/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: withdrawToken,
          amount: Number.parseFloat(withdrawAmount),
          destination: withdrawDestination,
          provider: withdrawProvider,
          currency: withdrawCurrency,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert(`Withdrawal successful! TX ID: ${data.txId}`)
        setWithdrawAmount("")
        setWithdrawDestination("")
        fetchWalletBalance()
      } else {
        alert(`Withdrawal failed: ${data.error}`)
      }
    } catch (error) {
      alert("Withdrawal failed")
    }
  }

  const handleSetLiquidity = async () => {
    if (!liquidityAmount) {
      alert("Please enter liquidity amount")
      return
    }

    try {
      const response = await fetch("/api/admin/exchange/liquidity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: liquidityToken,
          amount: Number.parseFloat(liquidityAmount),
          adminAddress: ADMIN_WALLET,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert("Liquidity updated successfully!")
        setLiquidityAmount("")
        fetchExchangeStats()
      } else {
        alert(`Failed to set liquidity: ${data.error}`)
      }
    } catch (error) {
      alert("Failed to set liquidity")
    }
  }

  const handleApprove = async (chainId: number, address: string) => {
    try {
      const response = await fetch("/api/admin/tokens/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chainId, address }),
      })

      if (response.ok) {
        fetchPendingTokens()
      }
    } catch (error) {
      console.error("[v0] Approval failed:", error)
    }
  }

  const handleReject = async (chainId: number, address: string) => {
    try {
      const response = await fetch("/api/admin/tokens/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chainId, address }),
      })

      if (response.ok) {
        fetchPendingTokens()
      }
    } catch (error) {
      console.error("[v0] Rejection failed:", error)
    }
  }

  if (!isAuthenticated) {
    return (
      <>
        <GL hovering={false} />
        <Navigation />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <BackButton />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <GlassCard className="p-8">
              <h1 className="text-3xl font-bold text-white mb-2 text-center">Admin Login</h1>
              <p className="text-white/60 text-center mb-8">
                Access the Gorrillazz admin dashboard
                {isConnected && <span className="block mt-2 text-sm">Connected wallet: {address}</span>}
              </p>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Username</label>
                  <GlassInput
                    type="text"
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                  <GlassInput
                    label="Password"
                    className=""
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <GlassButton type="submit" disabled={loading} className="w-full" onClick={() => {}}>
                  {loading ? "Logging in..." : "Login"}
                </GlassButton>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <>
      <GL hovering={false} />
      <Navigation />
      <div className="relative z-10 min-h-screen px-4 py-20">
        <BackButton />
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-white/60">
                Full control over Gorrillazz platform, exchange, and payments
                <span className="block mt-1 text-sm">Admin Wallet: {ADMIN_WALLET}</span>
              </p>
            </div>
            <GlassButton onClick={handleLogout} className="" disabled={false}>Logout</GlassButton>
          </div>

          <div className="flex gap-2 mb-6">
            <GlassButton
              onClick={() => setActiveTab("wallet")}
              className={activeTab === "wallet" ? "bg-purple-500/30" : ""}
              disabled={false}
            >
              Wallet & Payments
            </GlassButton>
            <GlassButton
              onClick={() => setActiveTab("exchange")}
              className={activeTab === "exchange" ? "bg-purple-500/30" : ""}
              disabled={false}
            >
              Exchange & Liquidity
            </GlassButton>
            <GlassButton
              onClick={() => setActiveTab("tokens")}
              className={activeTab === "tokens" ? "bg-purple-500/30" : ""}
              disabled={false}
            >
              Token Verifications
            </GlassButton>
          </div>

          {activeTab === "wallet" && (
            <div className="space-y-6">
              <GlassCard className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Admin Wallet Balance</h2>
                {walletBalance && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-white/60 text-sm mb-1">GORR (EUR 1:1)</p>
                      <p className="text-2xl font-bold text-purple-400">{walletBalance.gorr.toLocaleString()}</p>
                      <p className="text-white/40 text-xs mt-1">€{walletBalance.gorr.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-white/60 text-sm mb-1">USDCc</p>
                      <p className="text-2xl font-bold text-blue-400">{walletBalance.usdcc.toLocaleString()}</p>
                      <p className="text-white/40 text-xs mt-1">${walletBalance.usdcc.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-white/60 text-sm mb-1">ETH</p>
                      <p className="text-2xl font-bold text-blue-300">{walletBalance.eth.toFixed(2)}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-white/60 text-sm mb-1">BNB</p>
                      <p className="text-2xl font-bold text-yellow-400">{walletBalance.bnb.toFixed(2)}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-white/60 text-sm mb-1">SOL</p>
                      <p className="text-2xl font-bold text-green-400">{walletBalance.sol.toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Withdraw Funds (Fee-Free)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Token</label>
                    <select
                      value={withdrawToken}
                      onChange={(e) => setWithdrawToken(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="GORR">GORR</option>
                      <option value="USDCc">USDCc</option>
                      <option value="ETH">ETH</option>
                      <option value="BNB">BNB</option>
                      <option value="SOL">SOL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Amount</label>
                    <GlassInput
                      label="Amount"
                      className=""
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Payment Provider</label>
                    <select
                      value={withdrawProvider}
                      onChange={(e) => setWithdrawProvider(e.target.value as "revolut" | "paypal")}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="revolut">Revolut (Primary)</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Currency</label>
                    <select
                      value={withdrawCurrency}
                      onChange={(e) => setWithdrawCurrency(e.target.value as "USD" | "EUR")}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-white/80 text-sm font-medium mb-2">Destination Account</label>
                    <GlassInput
                      label="Destination Account"
                      className=""
                      type="text"
                      value={withdrawDestination}
                      onChange={(e) => setWithdrawDestination(e.target.value)}
                      placeholder="Enter account email or ID"
                    />
                  </div>
                </div>
                <GlassButton onClick={handleWithdraw}
                 className="mt-4 w-full bg-green-500/20 hover:bg-green-500/30">
                  Withdraw (Instant & Fee-Free)
                </GlassButton>
              </GlassCard>
            </div>
          )}

          {activeTab === "exchange" && (
            <div className="space-y-6">
              <GlassCard className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Exchange Statistics</h2>
                {exchangeStats && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-white/60 text-sm mb-1">24h Volume</p>
                      <p className="text-2xl font-bold text-green-400">€{exchangeStats.volume24h.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-white/60 text-sm mb-1">24h Trades</p>
                      <p className="text-2xl font-bold text-blue-400">{exchangeStats.trades24h.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-white/60 text-sm mb-1">Total Liquidity</p>
                      <p className="text-2xl font-bold text-purple-400">
                        €{exchangeStats.liquidity.reduce((sum, l) => sum + l.total, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                <h3 className="text-xl font-bold text-white mb-3">Liquidity Pools</h3>
                {exchangeStats?.liquidity.map((pool) => (
                  <div key={pool.token} className="bg-white/5 rounded-lg p-4 mb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-semibold">{pool.token}</p>
                        <p className="text-white/60 text-sm">
                          Available: {pool.available.toLocaleString()} | Locked: {pool.locked.toLocaleString()}
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-purple-400">{pool.total.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Set Liquidity</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Token</label>
                    <select
                      value={liquidityToken}
                      onChange={(e) => setLiquidityToken(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="GORR">GORR</option>
                      <option value="USDCc">USDCc</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Amount</label>
                    <GlassInput
                      label="Amount"
                      className=""
                      type="number"
                      value={liquidityAmount}
                      onChange={(e) => setLiquidityAmount(e.target.value)}
                      placeholder="Enter liquidity amount"
                    />
                  </div>
                </div>
                <GlassButton
                  onClick={handleSetLiquidity}
                  className="mt-4 w-full bg-purple-500/20 hover:bg-purple-500/30"
                >
                  Update Liquidity
                </GlassButton>
              </GlassCard>
            </div>
          )}

          {activeTab === "tokens" && (
            <div className="space-y-6">
              <GlassCard className="p-6 mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Fee Structure</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/60 text-sm mb-1">GORR Token</p>
                    <p className="text-2xl font-bold text-green-400">FREE</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/60 text-sm mb-1">USDCc Token</p>
                    <p className="text-2xl font-bold text-green-400">FREE</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/60 text-sm mb-1">Other Tokens</p>
                    <p className="text-2xl font-bold text-blue-400">200 GORR</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Pending Verifications ({pendingTokens.length})</h2>

                {pendingTokens.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-white/60">No pending token verifications</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingTokens.map((token) => (
                      <motion.div
                        key={`${token.chainId}-${token.address}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 rounded-lg p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={token.logoURI || "/placeholder.svg"}
                            alt={token.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <h3 className="text-white font-semibold">
                              {token.name} ({token.symbol})
                            </h3>
                            <p className="text-white/60 text-sm">{token.address}</p>
                            {token.extensions?.website && (
                              <a
                                href={token.extensions.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 text-sm hover:underline"
                              >
                                {token.extensions.website}
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right mr-4">
                            <p className="text-white/60 text-sm">Registration Fee</p>
                            <p className="text-white font-semibold">
                              {token.symbol === "GORR" || token.symbol === "USDCc" ? "FREE" : "200 GORR"}
                            </p>
                          </div>
                          <GlassButton
                            onClick={() => handleApprove(token.chainId, token.address)}
                            className="bg-green-500/20 hover:bg-green-500/30"
                          >
                            Approve
                          </GlassButton>
                          <GlassButton
                            onClick={() => handleReject(token.chainId, token.address)}
                            className="bg-red-500/20 hover:bg-red-500/30"
                          >
                            Reject
                          </GlassButton>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
