export class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api"
  }

  async createToken(walletAddress: string, walletType: string, tokenData: any) {
    const response = await fetch(`${this.baseUrl}/tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress,
        walletType,
        tokenData,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create token")
    }

    return response.json()
  }

  async getTokens(walletAddress?: string, status?: string) {
    const params = new URLSearchParams()
    if (walletAddress) params.append("walletAddress", walletAddress)
    if (status) params.append("status", status)

    const response = await fetch(`${this.baseUrl}/tokens?${params.toString()}`)

    if (!response.ok) {
      throw new Error("Failed to fetch tokens")
    }

    return response.json()
  }

  async getToken(id: string) {
    const response = await fetch(`${this.baseUrl}/tokens/${id}`)

    if (!response.ok) {
      throw new Error("Failed to fetch token")
    }

    return response.json()
  }

  async updateToken(id: string, data: any) {
    const response = await fetch(`${this.baseUrl}/tokens/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to update token")
    }

    return response.json()
  }

  async getLiquidityPools(tokenId?: string, network?: string) {
    const params = new URLSearchParams()
    if (tokenId) params.append("tokenId", tokenId)
    if (network) params.append("network", network)

    const response = await fetch(`${this.baseUrl}/liquidity?${params.toString()}`)

    if (!response.ok) {
      throw new Error("Failed to fetch liquidity pools")
    }

    return response.json()
  }

  async createLiquidityPool(data: any) {
    const response = await fetch(`${this.baseUrl}/liquidity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to create liquidity pool")
    }

    return response.json()
  }

  async getTransactions(walletAddress?: string, tokenId?: string, type?: string) {
    const params = new URLSearchParams()
    if (walletAddress) params.append("walletAddress", walletAddress)
    if (tokenId) params.append("tokenId", tokenId)
    if (type) params.append("type", type)

    const response = await fetch(`${this.baseUrl}/transactions?${params.toString()}`)

    if (!response.ok) {
      throw new Error("Failed to fetch transactions")
    }

    return response.json()
  }

  async getBalance(walletAddress: string) {
    const response = await fetch(`${this.baseUrl}/balance?walletAddress=${walletAddress}`)

    if (!response.ok) {
      throw new Error("Failed to fetch balance")
    }

    return response.json()
  }
}

export const apiClient = new ApiClient()
