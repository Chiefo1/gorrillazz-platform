"use client"

import { motion } from "framer-motion"
import ShaderBackground from "@/components/shader-background"
import { Navigation } from "@/components/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Rocket, Coins, Droplets, Shield, Zap, Globe } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: Coins,
      title: "Multi-Chain Token Creation",
      description: "Deploy tokens on Solana, Ethereum, BNB, and Gorrillazz network with one click.",
    },
    {
      icon: Droplets,
      title: "Instant Liquidity",
      description: "Automatically seed liquidity pools on major DEXs or our native exchange.",
    },
    {
      icon: Shield,
      title: "GORR Stablecoin",
      description: "Pay platform fees with our native stablecoin for seamless transactions.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Deploy and manage tokens in seconds with our optimized infrastructure.",
    },
    {
      icon: Globe,
      title: "Cross-Chain Bridge",
      description: "Move assets seamlessly between supported blockchain networks.",
    },
    {
      icon: Rocket,
      title: "Launch Ready",
      description: "Complete token metadata, logos, and IPFS storage included.",
    },
  ]

  const stats = [
    { value: "$2.5B+", label: "Total Value Locked" },
    { value: "50K+", label: "Tokens Created" },
    { value: "15+", label: "Supported Chains" },
    { value: "99.9%", label: "Uptime" },
  ]

  return (
    <ShaderBackground>
      <Navigation />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-24">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm text-muted-foreground">Powered by GORR Stablecoin</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
              Create tokens
              <br />
              <span className="neon-text">across chains</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              The ultimate multi-chain token creation and liquidity platform. Deploy on Solana, Ethereum, BNB, and our
              native Gorrillazz network in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="neon-glow text-lg px-8 py-6">
                <Rocket className="w-5 h-5 mr-2" />
                Create Your Token
              </Button>
              <Button size="lg" variant="outline" className="glass text-lg px-8 py-6 bg-transparent">
                View Documentation
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24"
          >
            {stats.map((stat, index) => (
              <GlassCard key={index} className="p-6">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything you need</h2>
            <p className="text-xl text-muted-foreground">Professional-grade tools for token creation and management</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard className="p-6 h-full hover:glass-strong transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to launch?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of projects building the future of Web3 with Gorrillazz
              </p>
              <Button size="lg" className="neon-glow text-lg px-8 py-6">
                Get Started Now
              </Button>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      {/* Pulsing Circle with GORRILLAZZ branding */}
      <div className="fixed bottom-8 right-8 z-30">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-20 blur-xl animate-pulse" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="relative w-16 h-16 rounded-full glass-strong flex items-center justify-center neon-glow"
          >
            <span className="text-2xl">🦍</span>
          </motion.div>
        </div>
      </div>
    </ShaderBackground>
  )
}
