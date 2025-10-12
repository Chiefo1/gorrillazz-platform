import { MongoClient, type Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env")
}

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB_NAME || "gorrillazz"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = await MongoClient.connect(uri)
  const db = client.db(dbName)

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function getCollection(collectionName: string) {
  const { db } = await connectToDatabase()
  return db.collection(collectionName)
}

// Collection names
export const Collections = {
  USERS: "users",
  TOKENS: "tokens",
  LIQUIDITY_POOLS: "liquidityPools",
  TRANSACTIONS: "transactions",
  GORR_PRICES: "gorrPrices",
}

// MongoDB Schema Types
export interface UserDocument {
  _id?: string
  walletAddress: string
  email?: string
  username?: string
  gorrBalance: number
  createdAt: Date
  updatedAt: Date
}

export interface TokenDocument {
  _id?: string
  name: string
  symbol: string
  description?: string
  totalSupply: string
  decimals: number
  logoUrl?: string
  network: string
  contractAddress?: string
  creatorId: string
  status: "pending" | "deploying" | "deployed" | "failed"
  mintable: boolean
  burnable: boolean
  pausable: boolean
  website?: string
  twitter?: string
  telegram?: string
  discord?: string
  createdAt: Date
  updatedAt: Date
}

export interface LiquidityPoolDocument {
  _id?: string
  tokenId: string
  initialLiquidity: string
  lockPeriod: number
  lockedUntil?: Date
  poolAddress?: string
  status: "pending" | "active" | "locked" | "unlocked"
  createdAt: Date
  updatedAt: Date
}

export interface TransactionDocument {
  _id?: string
  userId: string
  tokenId?: string
  type: "deploy" | "transfer" | "swap" | "liquidity_add" | "liquidity_remove"
  amount?: string
  fromAddress?: string
  toAddress?: string
  txHash?: string
  network: string
  status: "pending" | "confirmed" | "failed"
  createdAt: Date
  updatedAt: Date
}
