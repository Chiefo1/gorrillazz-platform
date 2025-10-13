"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import ShaderBackground from "@/components/shader-background"
import Navigation from "@/components/navigation"
import BackButton from "@/components/back-button"
import GlassCard from "@/components/glass/glass-card"
import GlassButton from "@/components/glass/glass-button"
import GlassInput from "@/components/glass/glass-input"
import GlassModal from "@/components/glass/glass-modal"
import { useWallet } from "@/lib/wallet-context"
import { Wallet, Plus, Copy, Check, Download, Key, Shield } from "lucide-react"

export default function WalletPage() {
  const { address, chain, balance, gorrBalance, isConnected, disconnect } = useWallet()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [walletName, setWalletName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [seedPhrase, setSeedPhrase] = useState<string[]>([])
  const [step, setStep] = useState<"form" | "seed" | "success">("form")
  const [copied, setCopied] = useState(false)

  const generateSeedPhrase = () => {
    const words = [
      "abandon",
      "ability",
      "able",
      "about",
      "above",
      "absent",
      "absorb",
      "abstract",
      "absurd",
      "abuse",
      "access",
      "accident",
    ]
    return Array.from({ length: 12 }, () => words[Math.floor(Math.random() * words.length)])
  }

  const handleCreateWallet = () => {
    if (!walletName || !password || password !== confirmPassword) {
      alert("Please fill all fields correctly")
      return
    }

    const phrase = generateSeedPhrase()
    setSeedPhrase(phrase)
    setStep("seed")
  }

  const handleCopySeed = () => {
    navigator.clipboard.writeText(seedPhrase.join(" "))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFinishCreate = () => {
    setStep("success")
    setTimeout(() => {
      setShowCreateModal(false)
      setStep("form")
      setWalletName("")
      setPassword("")
      setConfirmPassword("")
      setSeedPhrase([])
    }, 2000)
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <ShaderBackground>
      <Navigation />
      <BackButton href="/" />

      <main className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
              Your <span className="text-primary">Wallet</span>
            </h1>
            <p className="text-lg text-muted-foreground">Manage your Gorrillazz wallet and assets</p>
          </motion.div>

          {isConnected ? (
            <div className="space-y-6">
              {/* Wallet Info Card */}
              <GlassCard variant="primary">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/30 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">Connected Wallet</h3>
                      <p className="text-sm text-muted-foreground capitalize">{chain} Network</p>
                    </div>
                  </div>
                  <GlassButton variant="danger" size="sm" onClick={disconnect}>
                    Disconnect
                  </GlassButton>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <span className="text-sm text-muted-foreground">Address</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-foreground font-mono">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </code>
                      <button onClick={copyAddress} className="p-1 hover:bg-white/10 rounded transition-colors">
                        {copied ? (
                          <Check className="w-4 h-4 text-accent" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5">
                      <p className="text-sm text-muted-foreground mb-1">Balance</p>
                      <p className="text-2xl font-bold text-foreground">{balance.toFixed(4)}</p>
                      <p className="text-xs text-muted-foreground uppercase">{chain}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                      <p className="text-sm text-muted-foreground mb-1">GORR Balance</p>
                      <p className="text-2xl font-bold text-accent">{gorrBalance.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">GORR</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard hover={false}>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                      <Download className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">Receive</h4>
                    <p className="text-sm text-muted-foreground">Get tokens</p>
                  </div>
                </GlassCard>

                <GlassCard hover={false}>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-3">
                      <Key className="w-6 h-6 text-accent" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">Export</h4>
                    <p className="text-sm text-muted-foreground">Backup keys</p>
                  </div>
                </GlassCard>

                <GlassCard hover={false}>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-destructive" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">Security</h4>
                    <p className="text-sm text-muted-foreground">Manage access</p>
                  </div>
                </GlassCard>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Create New Wallet Card */}
              <GlassCard variant="primary">
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-2xl bg-primary/30 flex items-center justify-center mx-auto mb-6">
                    <Plus className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Create New Wallet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Generate a new Gorrillazz wallet with a secure seed phrase. Keep it safe!
                  </p>
                  <GlassButton variant="primary" size="lg" onClick={() => setShowCreateModal(true)}>
                    <Plus className="w-5 h-5 mr-2" />
                    Create Wallet
                  </GlassButton>
                </div>
              </GlassCard>

              {/* Or Connect Existing */}
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Or connect an existing wallet</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <GlassButton variant="default" size="md">
                    Connect Phantom
                  </GlassButton>
                  <GlassButton variant="default" size="md">
                    Connect MetaMask
                  </GlassButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Wallet Modal */}
      <GlassModal open={showCreateModal} onClose={() => setShowCreateModal(false)}>
        {step === "form" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Create New Wallet</h2>
            <div className="space-y-4">
              <GlassInput
                label="Wallet Name"
                placeholder="My Gorrillazz Wallet"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
              />
              <GlassInput
                label="Password"
                type="password"
                placeholder="Enter a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <GlassInput
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <GlassButton variant="transparent" onClick={() => setShowCreateModal(false)} className="flex-1">
                Cancel
              </GlassButton>
              <GlassButton variant="primary" onClick={handleCreateWallet} className="flex-1">
                Generate Seed
              </GlassButton>
            </div>
          </div>
        )}

        {step === "seed" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Your Seed Phrase</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Write down these 12 words in order. Never share them with anyone!
            </p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {seedPhrase.map((word, index) => (
                <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-xs text-muted-foreground mr-2">{index + 1}.</span>
                  <span className="text-sm font-mono text-foreground">{word}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <GlassButton variant="transparent" onClick={handleCopySeed} className="flex-1">
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied!" : "Copy"}
              </GlassButton>
              <GlassButton variant="primary" onClick={handleFinishCreate} className="flex-1">
                I've Saved It
              </GlassButton>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Wallet Created!</h2>
            <p className="text-muted-foreground">Your new wallet is ready to use</p>
          </div>
        )}
      </GlassModal>
    </ShaderBackground>
  )
}
