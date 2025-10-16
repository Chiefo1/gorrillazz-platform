export const ADMIN_WALLET_ADDRESS = process.env.ADMIN_WALLET_ADDRESS || "gorr_admin_wallet_2024"

export interface AdminWalletBalance {
  gorr: number
  usdcc: number
  eth: number
  bnb: number
  sol: number
}

export interface AdminTransaction {
  id: string
  type: "deposit" | "withdrawal" | "trade" | "transfer"
  token: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed"
  timestamp: Date
  txHash?: string
}

export async function getAdminWalletBalance(): Promise<AdminWalletBalance> {
  // In production, this would query actual blockchain balances
  return {
    gorr: 1000000, // 1M GORR
    usdcc: 500000, // 500K USDCc
    eth: 10.5,
    bnb: 25.3,
    sol: 150.7,
  }
}

export async function getAdminTransactionHistory(limit = 50): Promise<AdminTransaction[]> {
  // In production, this would query from database
  return []
}

export function isAdminWallet(address: string): boolean {
  return address === ADMIN_WALLET_ADDRESS
}

export async function adminWithdraw(
  token: string,
  amount: number,
  destination: string,
  provider: "revolut" | "paypal",
  currency: "USD" | "EUR",
): Promise<{ success: boolean; txId?: string; error?: string }> {
  try {
    // Admin withdrawals are fee-free and instant
    console.log("[v0] Admin withdrawal:", { token, amount, destination, provider, currency })

    // In production, this would interact with payment provider APIs
    const txId = `admin_withdraw_${Date.now()}_${Math.random().toString(36).substring(7)}`

    return {
      success: true,
      txId,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Withdrawal failed",
    }
  }
}
