"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GL } from "@/components/gl"
import { Header } from "@/components/header"
import BackButton from "@/components/back-button"
import { GlassCard, GlassButton, GlassInput } from "@/components/glass"
import { motion } from "framer-motion"

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

export default function AdminPage() {
  const [hovering, setHovering] = useState(false)
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [pendingTokens, setPendingTokens] = useState<PendingToken[]>([])

  useEffect(() => {
    if (isAuthenticated) {
      fetchPendingTokens()
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
      console.error("Failed to fetch pending tokens:", error)
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
      console.error("Logout failed:", error)
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
      console.error("Approval failed:", error)
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
      console.error("Rejection failed:", error)
    }
  }

  if (!isAuthenticated) {
    return (
      <>
        <GL hovering={hovering} />
        <Header />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <BackButton />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <GlassCard className="p-8">
              <h1 className="text-3xl font-bold text-white mb-2 text-center">Admin Login</h1>
              <p className="text-white/60 text-center mb-8">Access the Gorrillazz admin dashboard</p>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Username</label>
                  <GlassInput
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                  <GlassInput
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

                <GlassButton type="submit" disabled={loading} className="w-full">
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
      <GL hovering={hovering} />
      <Header />
      <div className="relative z-10 min-h-screen px-4 py-20">
        <BackButton />
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-white/60">Manage token verifications and registrations</p>
            </div>
            <GlassButton onClick={handleLogout}>Logout</GlassButton>
          </div>

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
      </div>
    </>
  )
}
