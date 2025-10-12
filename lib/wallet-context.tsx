"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type WalletType = "phantom" | "metamask" | "walletconnect" | "gorrillazz" | null

interface WalletContextType {
  walletType: WalletType
  address: string | null
  balance: string | null
  isConnected: boolean
  isConnecting: boolean
  connect: (type: WalletType) => Promise<void>
  disconnect: () => void
  switchNetwork: (network: string) => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletType, setWalletType] = useState<WalletType>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const isConnected = !!address

  // Check for existing wallet connection on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem("connectedWallet")
    if (savedWallet) {
      connect(savedWallet as WalletType)
    }
  }, [])

  const connect = async (type: WalletType) => {
    if (!type) return

    setIsConnecting(true)
    try {
      switch (type) {
        case "phantom":
          await connectPhantom()
          break
        case "metamask":
          await connectMetaMask()
          break
        case "walletconnect":
          await connectWalletConnect()
          break
        case "gorrillazz":
          await connectGorrillazz()
          break
      }
      localStorage.setItem("connectedWallet", type)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const connectPhantom = async () => {
    if (typeof window !== "undefined" && "solana" in window) {
      const provider = (window as any).solana
      if (provider?.isPhantom) {
        const response = await provider.connect()
        setWalletType("phantom")
        setAddress(response.publicKey.toString())
        // Fetch balance
        const balance = await provider.getBalance(response.publicKey)
        setBalance((balance / 1e9).toFixed(4))
      }
    } else {
      window.open("https://phantom.app/", "_blank")
    }
  }

  const connectMetaMask = async () => {
    if (typeof window !== "undefined" && "ethereum" in window) {
      const provider = (window as any).ethereum
      const accounts = await provider.request({ method: "eth_requestAccounts" })
      setWalletType("metamask")
      setAddress(accounts[0])
      // Fetch balance
      const balance = await provider.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })
      setBalance((Number.parseInt(balance, 16) / 1e18).toFixed(4))
    } else {
      window.open("https://metamask.io/", "_blank")
    }
  }

  const connectWalletConnect = async () => {
    // WalletConnect integration would go here
    console.log("WalletConnect integration coming soon")
  }

  const connectGorrillazz = async () => {
    // Custom Gorrillazz wallet integration
    // For demo purposes, we'll simulate a connection
    setWalletType("gorrillazz")
    setAddress("gorr1" + Math.random().toString(36).substring(2, 15))
    setBalance("1000.00")
  }

  const disconnect = () => {
    setWalletType(null)
    setAddress(null)
    setBalance(null)
    localStorage.removeItem("connectedWallet")
  }

  const switchNetwork = async (network: string) => {
    if (walletType === "metamask" && typeof window !== "undefined" && "ethereum" in window) {
      const provider = (window as any).ethereum
      const networkIds: Record<string, string> = {
        ethereum: "0x1",
        bnb: "0x38",
        polygon: "0x89",
      }
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: networkIds[network] }],
        })
      } catch (error) {
        console.error("Failed to switch network:", error)
      }
    }
  }

  return (
    <WalletContext.Provider
      value={{
        walletType,
        address,
        balance,
        isConnected,
        isConnecting,
        connect,
        disconnect,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
