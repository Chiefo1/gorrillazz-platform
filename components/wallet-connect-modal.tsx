"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X, Wallet, ExternalLink } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { useWallet } from "@/lib/wallet-context"

interface WalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletConnectModal({ isOpen, onClose }: WalletConnectModalProps) {
  const { connect, isConnecting } = useWallet()

  const wallets = [
    {
      id: "phantom" as const,
      name: "Phantom",
      description: "Connect to Solana network",
      icon: "👻",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "metamask" as const,
      name: "MetaMask",
      description: "Connect to Ethereum & EVM chains",
      icon: "🦊",
      color: "from-orange-500 to-yellow-500",
    },
    {
      id: "walletconnect" as const,
      name: "WalletConnect",
      description: "Connect with mobile wallets",
      icon: "🔗",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "gorrillazz" as const,
      name: "Gorrillazz Wallet",
      description: "Native Gorrillazz network wallet",
      icon: "🦍",
      color: "from-green-500 to-emerald-500",
    },
  ]

  const handleConnect = async (walletId: (typeof wallets)[number]["id"]) => {
    await connect(walletId)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md"
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl glass-strong flex items-center justify-center">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold">Connect Wallet</h2>
                  </div>
                  <button onClick={onClose} className="glass p-2 rounded-lg hover:glass-strong transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-muted-foreground mb-6">Choose your preferred wallet to connect to Gorrillazz</p>

                <div className="space-y-3">
                  {wallets.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => handleConnect(wallet.id)}
                      disabled={isConnecting}
                      className="w-full glass rounded-xl p-4 hover:glass-strong transition-all group disabled:opacity-50"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${wallet.color} flex items-center justify-center text-2xl`}
                        >
                          {wallet.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-bold group-hover:text-primary transition-colors">{wallet.name}</h3>
                          <p className="text-sm text-muted-foreground">{wallet.description}</p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    By connecting a wallet, you agree to Gorrillazz Terms of Service and Privacy Policy
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
