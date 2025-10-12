"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ShaderBackground from "@/components/shader-background"
import { Navigation } from "@/components/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronRight, ChevronLeft, Check, Upload, Coins, Network, FileText, Droplets, Eye } from "lucide-react"
import { useWallet } from "@/lib/wallet-context"
import { apiClient } from "@/lib/api-client"
import { useRouter } from "next/navigation"

type WizardStep = 1 | 2 | 3 | 4 | 5

interface TokenData {
  networks: string[]
  name: string
  symbol: string
  decimals: string
  totalSupply: string
  description: string
  logoUrl: string
  liquidityOption: "own" | "dex" | "none"
  liquidityAmount: string
  dexPlatform: string
}

export default function CreateTokenPage() {
  const router = useRouter()
  const { address, walletType, isConnected } = useWallet()
  const [currentStep, setCurrentStep] = useState<WizardStep>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tokenData, setTokenData] = useState<TokenData>({
    networks: [],
    name: "",
    symbol: "",
    decimals: "18",
    totalSupply: "",
    description: "",
    logoUrl: "",
    liquidityOption: "own",
    liquidityAmount: "",
    dexPlatform: "uniswap",
  })

  const steps = [
    { number: 1, title: "Networks", icon: Network },
    { number: 2, title: "Token Details", icon: Coins },
    { number: 3, title: "Metadata", icon: FileText },
    { number: 4, title: "Liquidity", icon: Droplets },
    { number: 5, title: "Review", icon: Eye },
  ]

  const networks = [
    { id: "solana", name: "Solana", description: "Fast & low-cost SPL tokens" },
    { id: "ethereum", name: "Ethereum", description: "ERC-20 standard tokens" },
    { id: "bnb", name: "BNB Chain", description: "BEP-20 tokens" },
    { id: "gorrillazz", name: "Gorrillazz", description: "Native network tokens" },
  ]

  const handleNetworkToggle = (networkId: string) => {
    setTokenData((prev) => ({
      ...prev,
      networks: prev.networks.includes(networkId)
        ? prev.networks.filter((n) => n !== networkId)
        : [...prev.networks, networkId],
    }))
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as WizardStep)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep)
    }
  }

  const handleSubmit = async () => {
    if (!isConnected || !address || !walletType) {
      alert("Please connect your wallet first")
      return
    }

    setIsSubmitting(true)
    try {
      const result = await apiClient.createToken(address, walletType, tokenData)
      console.log("Token created:", result)
      router.push(`/dashboard`)
    } catch (error) {
      console.error("Failed to create token:", error)
      alert("Failed to create token. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ShaderBackground>
      <Navigation />

      <div className="min-h-screen pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-2">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: currentStep === step.number ? 1.1 : 1,
                      }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        currentStep === step.number
                          ? "glass-strong neon-glow"
                          : currentStep > step.number
                            ? "bg-primary"
                            : "glass"
                      }`}
                    >
                      {currentStep > step.number ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                    </motion.div>
                    <span className="text-xs text-muted-foreground hidden md:block">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && <div className="flex-1 h-px bg-border mx-2 md:mx-4" />}
                </div>
              ))}
            </div>
          </div>

          {/* Wizard Content */}
          <GlassCard className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {/* Step 1: Network Selection */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-3xl font-bold mb-2">Choose Networks</h2>
                  <p className="text-muted-foreground mb-8">
                    Select one or more blockchain networks to deploy your token
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {networks.map((network) => (
                      <div
                        key={network.id}
                        onClick={() => handleNetworkToggle(network.id)}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                          tokenData.networks.includes(network.id)
                            ? "border-primary bg-primary/10"
                            : "border-border glass hover:glass-strong"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={tokenData.networks.includes(network.id)}
                            onCheckedChange={() => handleNetworkToggle(network.id)}
                          />
                          <div>
                            <h3 className="font-bold mb-1">{network.name}</h3>
                            <p className="text-sm text-muted-foreground">{network.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Token Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-3xl font-bold mb-2">Token Details</h2>
                  <p className="text-muted-foreground mb-8">Define your token's core properties</p>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Token Name</Label>
                        <Input
                          id="name"
                          placeholder="e.g., Gorrillazz Token"
                          value={tokenData.name}
                          onChange={(e) => setTokenData({ ...tokenData, name: e.target.value })}
                          className="glass"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="symbol">Token Symbol</Label>
                        <Input
                          id="symbol"
                          placeholder="e.g., GORR"
                          value={tokenData.symbol}
                          onChange={(e) => setTokenData({ ...tokenData, symbol: e.target.value })}
                          className="glass"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="decimals">Decimals</Label>
                        <Input
                          id="decimals"
                          type="number"
                          placeholder="18"
                          value={tokenData.decimals}
                          onChange={(e) => setTokenData({ ...tokenData, decimals: e.target.value })}
                          className="glass"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supply">Total Supply</Label>
                        <Input
                          id="supply"
                          type="number"
                          placeholder="1000000"
                          value={tokenData.totalSupply}
                          onChange={(e) => setTokenData({ ...tokenData, totalSupply: e.target.value })}
                          className="glass"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Metadata */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-3xl font-bold mb-2">Token Metadata</h2>
                  <p className="text-muted-foreground mb-8">Add description and logo for your token</p>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your token's purpose and utility..."
                        value={tokenData.description}
                        onChange={(e) => setTokenData({ ...tokenData, description: e.target.value })}
                        className="glass min-h-32"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Token Logo</Label>
                      <div className="glass rounded-xl p-8 border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 rounded-xl glass-strong flex items-center justify-center">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <div className="text-center">
                            <p className="font-medium mb-1">Click to upload or drag and drop</p>
                            <p className="text-sm text-muted-foreground">PNG, JPG or SVG (max. 2MB)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Liquidity */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-3xl font-bold mb-2">Liquidity Options</h2>
                  <p className="text-muted-foreground mb-8">Choose how to provide liquidity for your token</p>

                  <RadioGroup
                    value={tokenData.liquidityOption}
                    onValueChange={(value) =>
                      setTokenData({
                        ...tokenData,
                        liquidityOption: value as "own" | "dex" | "none",
                      })
                    }
                    className="space-y-4"
                  >
                    <div className="glass rounded-xl p-6 border-2 border-border">
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="own" id="own" />
                        <div className="flex-1">
                          <Label htmlFor="own" className="font-bold cursor-pointer">
                            Gorrillazz Pool
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Create liquidity on our native DEX with lower fees
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="glass rounded-xl p-6 border-2 border-border">
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="dex" id="dex" />
                        <div className="flex-1">
                          <Label htmlFor="dex" className="font-bold cursor-pointer">
                            External DEX
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">Add to Uniswap, PancakeSwap, or Raydium</p>
                        </div>
                      </div>
                    </div>

                    <div className="glass rounded-xl p-6 border-2 border-border">
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="none" id="none" />
                        <div className="flex-1">
                          <Label htmlFor="none" className="font-bold cursor-pointer">
                            Skip for now
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">Add liquidity manually later</p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>

                  {tokenData.liquidityOption !== "none" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-6 space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="liquidityAmount">Initial Liquidity (GORR)</Label>
                        <Input
                          id="liquidityAmount"
                          type="number"
                          placeholder="1000"
                          value={tokenData.liquidityAmount}
                          onChange={(e) =>
                            setTokenData({
                              ...tokenData,
                              liquidityAmount: e.target.value,
                            })
                          }
                          className="glass"
                        />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-3xl font-bold mb-2">Review & Deploy</h2>
                  <p className="text-muted-foreground mb-8">Confirm your token details before deployment</p>

                  <div className="space-y-6">
                    <div className="glass rounded-xl p-6">
                      <h3 className="font-bold mb-4">Networks</h3>
                      <div className="flex flex-wrap gap-2">
                        {tokenData.networks.map((network) => (
                          <span key={network} className="px-3 py-1 rounded-full glass-strong text-sm">
                            {networks.find((n) => n.id === network)?.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="glass rounded-xl p-6">
                      <h3 className="font-bold mb-4">Token Details</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Name:</span>
                          <span className="ml-2 font-medium">{tokenData.name}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Symbol:</span>
                          <span className="ml-2 font-medium">{tokenData.symbol}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Decimals:</span>
                          <span className="ml-2 font-medium">{tokenData.decimals}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Supply:</span>
                          <span className="ml-2 font-medium">{tokenData.totalSupply}</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass rounded-xl p-6">
                      <h3 className="font-bold mb-4">Liquidity</h3>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Option:</span>
                        <span className="ml-2 font-medium capitalize">
                          {tokenData.liquidityOption === "own"
                            ? "Gorrillazz Pool"
                            : tokenData.liquidityOption === "dex"
                              ? "External DEX"
                              : "Skip"}
                        </span>
                      </p>
                      {tokenData.liquidityAmount && (
                        <p className="text-sm mt-2">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="ml-2 font-medium">{tokenData.liquidityAmount} GORR</span>
                        </p>
                      )}
                    </div>

                    <div className="glass-strong rounded-xl p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold">Platform Fee</span>
                        <span className="text-xl font-bold">50 GORR</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Includes deployment, metadata storage, and liquidity setup
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
              <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1} className="glass">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep < 5 ? (
                <Button onClick={handleNext} className="neon-glow">
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="neon-glow" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="animate-pulse">Deploying...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Deploy Token
                    </>
                  )}
                </Button>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </ShaderBackground>
  )
}
