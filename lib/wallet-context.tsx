"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type WalletType = "phantom" | "metamask" | "gorrillazz" | null
export type ChainType = "solana" | "ethereum" | "bnb" | "gorrillazz"

interface WalletContextType {
  walletType: WalletType
  address: string | null
  chain: ChainType | null
  isConnected: boolean
  isConnecting: boolean
  balance: number
  gorrBalance: number
  connect: (type: WalletType) => Promise<void>
  disconnect: () => void
  switchChain: (chain: ChainType) => Promise<void>
  refreshBalance: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletType, setWalletType] = useState<WalletType>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [chain, setChain] = useState<ChainType | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [balance, setBalance] = useState(0)
  const [gorrBalance, setGorrBalance] = useState(0)

  const isConnected = !!address && !!walletType

  useEffect(() => {
    const savedWallet = localStorage.getItem("gorrillazz_wallet")
    const savedAddress = localStorage.getItem("gorrillazz_address")
    const savedChain = localStorage.getItem("gorrillazz_chain")

    if (savedWallet && savedAddress && savedChain) {
      setWalletType(savedWallet as WalletType)
      setAddress(savedAddress)
      setChain(savedChain as ChainType)
    }
  }, [])

  const connect = async (type: WalletType) => {
    setIsConnecting(true)
    try {
      if (type === "phantom") {
        await connectPhantom()
      } else if (type === "metamask") {
        await connectMetaMask()
      } else if (type === "gorrillazz") {
        await connectGorrillazz()
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }

  const connectPhantom = async () => {
    if (typeof window === "undefined") return

    const { solana } = window as any
    if (!solana?.isPhantom) {
      window.open("https://phantom.app/", "_blank")
      throw new Error("Phantom wallet not installed")
    }

    const response = await solana.connect()
    const pubKey = response.publicKey.toString()

    setWalletType("phantom")
    setAddress(pubKey)
    setChain("solana")

    localStorage.setItem("gorrillazz_wallet", "phantom")
    localStorage.setItem("gorrillazz_address", pubKey)
    localStorage.setItem("gorrillazz_chain", "solana")
  }

  const connectMetaMask = async () => {
    if (typeof window === "undefined") return

    const { ethereum } = window as any
    if (!ethereum?.isMetaMask) {
      window.open("https://metamask.io/", "_blank")
      throw new Error("MetaMask not installed")
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" })
    const chainId = await ethereum.request({ method: "eth_chainId" })

    const chainMap: Record<string, ChainType> = {
      "0x1": "ethereum",
      "0x38": "bnb",
    }

    const detectedChain = chainMap[chainId] || "ethereum"

    setWalletType("metamask")
    setAddress(accounts[0])
    setChain(detectedChain)

    localStorage.setItem("gorrillazz_wallet", "metamask")
    localStorage.setItem("gorrillazz_address", accounts[0])
    localStorage.setItem("gorrillazz_chain", detectedChain)
  }

  const connectGorrillazz = async () => {
    const mockAddress = "gorr_" + Math.random().toString(36).substring(2, 15)

    setWalletType("gorrillazz")
    setAddress(mockAddress)
    setChain("gorrillazz")

    localStorage.setItem("gorrillazz_wallet", "gorrillazz")
    localStorage.setItem("gorrillazz_address", mockAddress)
    localStorage.setItem("gorrillazz_chain", "gorrillazz")
  }

  const disconnect = () => {
    setWalletType(null)
    setAddress(null)
    setChain(null)
    setBalance(0)
    setGorrBalance(0)

    localStorage.removeItem("gorrillazz_wallet")
    localStorage.removeItem("gorrillazz_address")
    localStorage.removeItem("gorrillazz_chain")
  }

  const switchChain = async (newChain: ChainType) => {
    if (!walletType) return

    if (walletType === "metamask") {
      const { ethereum } = window as any
      const chainIds: Record<ChainType, string> = {
        ethereum: "0x1",
        bnb: "0x38",
        solana: "0x1",
        gorrillazz: "0x270f",
      }

      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainIds[newChain] }],
        })
        setChain(newChain)
        localStorage.setItem("gorrillazz_chain", newChain)
      } catch (error) {
        console.error("Failed to switch chain:", error)
      }
    }
  }

  const refreshBalance = async () => {
    if (!address || !chain) return

    try {
      const response = await fetch(`/api/users/balance?wallet=${address}&network=${chain}`)
      const data = await response.json()

      if (data.nativeBalance !== undefined) {
        setBalance(data.nativeBalance)
      }
      if (data.gorrBalance !== undefined) {
        setGorrBalance(data.gorrBalance)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch balance:", error)
    }
  }

  useEffect(() => {
    if (isConnected) {
      refreshBalance()
      fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address }),
      }).catch(console.error)
    }
  }, [isConnected, address, chain])

  return (
    <WalletContext.Provider
      value={{
        walletType,
        address,
        chain,
        isConnected,
        isConnecting,
        balance,
        gorrBalance,
        connect,
        disconnect,
        switchChain,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider")
  }
  return context
}
