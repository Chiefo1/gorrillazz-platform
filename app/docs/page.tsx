"use client"

import ShaderBackground from "@/components/shader-background"
import { Navigation } from "@/components/navigation"
import { GlassCard } from "@/components/glass-card"
import { Book, Code, Rocket, Shield, Zap, Globe } from "lucide-react"

export default function DocsPage() {
  const sections = [
    {
      icon: Rocket,
      title: "Getting Started",
      description: "Learn how to create your first token on Gorrillazz",
      items: ["Connect your wallet", "Choose networks", "Configure token parameters", "Deploy and manage"],
    },
    {
      icon: Code,
      title: "API Reference",
      description: "Complete API documentation for developers",
      items: ["Token deployment API", "Liquidity pool API", "Transaction API", "Webhook integration"],
    },
    {
      icon: Shield,
      title: "Security",
      description: "Best practices for secure token deployment",
      items: ["Smart contract audits", "Anti-rug mechanisms", "Ownership verification", "Security checklist"],
    },
    {
      icon: Zap,
      title: "Advanced Features",
      description: "Unlock the full potential of Gorrillazz",
      items: ["Multi-chain deployment", "Custom liquidity strategies", "Token vesting", "Governance integration"],
    },
    {
      icon: Globe,
      title: "Network Support",
      description: "Supported blockchain networks and integrations",
      items: ["Solana SPL tokens", "Ethereum ERC-20", "BNB Chain BEP-20", "Gorrillazz native"],
    },
    {
      icon: Book,
      title: "Tutorials",
      description: "Step-by-step guides and examples",
      items: ["Create a meme coin", "Launch a utility token", "Set up liquidity pools", "Token migration guide"],
    },
  ]

  return (
    <ShaderBackground>
      <Navigation />

      <div className="min-h-screen pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Documentation</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build, deploy, and manage tokens on Gorrillazz
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section, index) => (
              <GlassCard key={index} className="p-6 hover:glass-strong transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <section.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="text-sm flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="p-12 text-center mt-12">
            <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-6">Join our community or reach out to our support team</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 rounded-xl glass-strong hover:neon-glow transition-all">Join Discord</button>
              <button className="px-6 py-3 rounded-xl glass-strong hover:neon-glow transition-all">
                Contact Support
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </ShaderBackground>
  )
}
