"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ethers } from "ethers"

export type WalletType = "trustwallet" | "binance" | "metamask" | "gorrillazz" | null
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
  const [chain, setChain] = useState<ChainType | null>("gorrillazz")
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
      if (type === "gorrillazz") {
        await connectGorrillazz()
      } else if (type === "trustwallet") {
        await connectTrustWallet()
      } else if (type === "binance") {
        await connectBinanceWallet()
      } else if (type === "metamask") {
        await connectMetaMask()
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }

  const connectTrustWallet = async () => {
    if (typeof window === "undefined") return

    const { ethereum } = window as any
    if (!ethereum?.isTrust) {
      window.open("https://trustwallet.com/", "_blank")
      throw new Error("Trust Wallet not installed")
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" })
    const chainId = await ethereum.request({ method: "eth_chainId" })

    const chainMap: Record<string, ChainType> = {
      "0x1": "ethereum",
      "0x38": "bnb",
      "0x270f": "gorrillazz",
    }

    const detectedChain = chainMap[chainId] || "gorrillazz"

    setWalletType("trustwallet")
    setAddress(accounts[0])
    setChain(detectedChain)

    localStorage.setItem("gorrillazz_wallet", "trustwallet")
    localStorage.setItem("gorrillazz_address", accounts[0])
    localStorage.setItem("gorrillazz_chain", detectedChain)
  }

  const connectBinanceWallet = async () => {
    if (typeof window === "undefined") return

    const { BinanceChain } = window as any
    if (!BinanceChain) {
      window.open("https://www.binance.com/en/wallet-direct", "_blank")
      throw new Error("Binance Wallet not installed")
    }

    const accounts = await BinanceChain.request({ method: "eth_requestAccounts" })

    setWalletType("binance")
    setAddress(accounts[0])
    setChain("bnb")

    localStorage.setItem("gorrillazz_wallet", "binance")
    localStorage.setItem("gorrillazz_address", accounts[0])
    localStorage.setItem("gorrillazz_chain", "bnb")
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
      "0x270f": "gorrillazz",
    }

    const detectedChain = chainMap[chainId] || "gorrillazz"

    setWalletType("metamask")
    setAddress(accounts[0])
    setChain(detectedChain)

    localStorage.setItem("gorrillazz_wallet", "metamask")
    localStorage.setItem("gorrillazz_address", accounts[0])
    localStorage.setItem("gorrillazz_chain", detectedChain)
  }

  const connectGorrillazz = async () => {
    try {
      // Generate a new wallet using ethers.js
      const wallet = ethers.Wallet.createRandom()
      const address = wallet.address
      const privateKey = wallet.privateKey

      // Store encrypted private key (in production, use proper encryption)
      const encryptedKey = await wallet.encrypt("user-password-here") // Replace with actual user password

      setWalletType("gorrillazz")
      setAddress(address)
      setChain("gorrillazz")

      localStorage.setItem("gorrillazz_wallet", "gorrillazz")
      localStorage.setItem("gorrillazz_address", address)
      localStorage.setItem("gorrillazz_chain", "gorrillazz")
      localStorage.setItem("gorrillazz_encrypted_key", encryptedKey)

      console.log("[GORR] Wallet created:", address)
    } catch (error) {
      console.error("[GORR] Failed to create wallet:", error)
      throw error
    }
  }

  const disconnect = () => {
    setWalletType(null)
    setAddress(null)
    setChain("gorrillazz")
    setBalance(0)
    setGorrBalance(0)

    localStorage.removeItem("gorrillazz_wallet")
    localStorage.removeItem("gorrillazz_address")
    localStorage.removeItem("gorrillazz_chain")
    localStorage.removeItem("gorrillazz_encrypted_key")
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
    if (!address || !chain) {
      console.log("[v0] Cannot refresh balance - no address or chain")
      return
    }

    try {
      console.log("[v0] Refreshing balance for:", address, chain)
      const response = await fetch(`/api/wallet/balance?wallet=${address}&chain=${chain}`)

      const contentType = response.headers.get("content-type")
      console.log("[v0] Response content-type:", contentType)

      if (!contentType || !contentType.includes("application/json")) {
        console.error("[v0] API returned non-JSON response, content-type:", contentType)
        const text = await response.text()
        console.error("[v0] Response text:", text.substring(0, 200))
        return
      }

      const data = await response.json()
      console.log("[v0] Balance data received:", data)

      if (data.totalValue !== undefined) {
        console.log("[v0] Setting balance to:", data.totalValue)
        setBalance(data.totalValue)
      }
      if (data.tokens) {
        const gorrToken = data.tokens.find((t: any) => t.symbol === "GORR")
        if (gorrToken) {
          console.log("[v0] Setting GORR balance to:", gorrToken.balance)
          setGorrBalance(Number.parseFloat(gorrToken.balance) || 0)
        }
      }
    } catch (error) {
      console.error("[v0] Failed to fetch balance:", error)
    }
  }

  useEffect(() => {
    if (isConnected) {
      console.log("[v0] Wallet connected, refreshing balance")
      refreshBalance()
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
