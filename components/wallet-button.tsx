"use client"

import { useState } from "react"
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/lib/wallet-context"
import { WalletConnectModal } from "@/components/wallet-connect-modal"
import { motion, AnimatePresence } from "framer-motion"

export function WalletButton() {
  const { isConnected, address, balance, disconnect, walletType } = useWallet()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getWalletIcon = () => {
    switch (walletType) {
      case "phantom":
        return "👻"
      case "metamask":
        return "🦊"
      case "walletconnect":
        return "🔗"
      case "gorrillazz":
        return "🦍"
      default:
        return null
    }
  }

  if (!isConnected) {
    return (
      <>
        <Button onClick={() => setIsModalOpen(true)} className="neon-glow">
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
        <WalletConnectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="glass-strong rounded-xl px-4 py-2 flex items-center gap-3 hover:neon-glow transition-all"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{getWalletIcon()}</span>
          <div className="text-left hidden sm:block">
            <div className="text-sm font-medium">{formatAddress(address!)}</div>
            <div className="text-xs text-muted-foreground">{balance} GORR</div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDropdownOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-64 glass-strong rounded-xl p-2 z-50"
            >
              <div className="p-3 border-b border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getWalletIcon()}</span>
                  <span className="text-sm font-medium capitalize">{walletType}</span>
                </div>
                <div className="text-xs text-muted-foreground mb-1">Balance</div>
                <div className="text-lg font-bold">{balance} GORR</div>
              </div>

              <div className="p-1">
                <button
                  onClick={copyAddress}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:glass transition-all text-left"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  <span className="text-sm">{copied ? "Copied!" : "Copy Address"}</span>
                </button>

                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:glass transition-all text-left">
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">View on Explorer</span>
                </button>

                <button
                  onClick={() => {
                    disconnect()
                    setIsDropdownOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:glass transition-all text-left text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Disconnect</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
