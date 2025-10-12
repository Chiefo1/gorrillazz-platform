from pymongo import MongoClient, ASCENDING, DESCENDING
import os
from datetime import datetime

# Connect to MongoDB
mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
client = MongoClient(mongodb_uri)
db = client['gorrillazz']

print("🦍 Initializing Gorrillazz MongoDB Database...")

# Create collections
collections = ['users', 'tokens', 'liquidityPools', 'transactions', 'gorrPrices']

for collection_name in collections:
    if collection_name not in db.list_collection_names():
        db.create_collection(collection_name)
        print(f"✅ Created collection: {collection_name}")
    else:
        print(f"⏭️  Collection already exists: {collection_name}")

# Create indexes for users collection
print("\n📊 Creating indexes for users...")
db.users.create_index([("walletAddress", ASCENDING)], unique=True)
db.users.create_index([("email", ASCENDING)], unique=True, sparse=True)
db.users.create_index([("username", ASCENDING)], unique=True, sparse=True)
db.users.create_index([("createdAt", DESCENDING)])

# Create indexes for tokens collection
print("📊 Creating indexes for tokens...")
db.tokens.create_index([("contractAddress", ASCENDING)], unique=True, sparse=True)
db.tokens.create_index([("creatorId", ASCENDING)])
db.tokens.create_index([("network", ASCENDING)])
db.tokens.create_index([("status", ASCENDING)])
db.tokens.create_index([("createdAt", DESCENDING)])
db.tokens.create_index([("symbol", ASCENDING)])

# Create indexes for liquidityPools collection
print("📊 Creating indexes for liquidityPools...")
db.liquidityPools.create_index([("tokenId", ASCENDING)], unique=True)
db.liquidityPools.create_index([("poolAddress", ASCENDING)], unique=True, sparse=True)
db.liquidityPools.create_index([("status", ASCENDING)])
db.liquidityPools.create_index([("createdAt", DESCENDING)])

# Create indexes for transactions collection
print("📊 Creating indexes for transactions...")
db.transactions.create_index([("userId", ASCENDING)])
db.transactions.create_index([("tokenId", ASCENDING)])
db.transactions.create_index([("txHash", ASCENDING)], unique=True, sparse=True)
db.transactions.create_index([("network", ASCENDING)])
db.transactions.create_index([("status", ASCENDING)])
db.transactions.create_index([("createdAt", DESCENDING)])
db.transactions.create_index([("type", ASCENDING)])

# Create indexes for gorrPrices collection
print("📊 Creating indexes for gorrPrices...")
db.gorrPrices.create_index([("timestamp", DESCENDING)])

# Insert initial GORR price
print("\n💰 Setting initial GORR price...")
initial_price = {
    "price": 1.00,
    "timestamp": datetime.utcnow()
}
db.gorrPrices.insert_one(initial_price)

print("\n✅ MongoDB initialization complete!")
print(f"📦 Database: {db.name}")
print(f"📊 Collections: {len(collections)}")
print("🦍 Gorrillazz platform is ready to launch!")

client.close()
