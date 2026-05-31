import { MongoClient } from "mongodb"

declare global {
  // eslint-disable-next-line no-var
  var mongoClient: MongoClient | undefined
}

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("Missing MONGODB_URI")
}

const client = global.mongoClient ?? new MongoClient(uri)

if (process.env.NODE_ENV !== "production") {
  global.mongoClient = client
}

let clientPromise: Promise<MongoClient> | null = null

export async function getMongoClient() {
  if (!clientPromise) {
    clientPromise = client.connect()
  }
  return clientPromise
}
