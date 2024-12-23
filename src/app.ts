import express from "express";
import http from "http";
import cors from "cors";
import { configDotenv } from "dotenv";
import { connectDB } from "./constants/db"
import { createApolloServer } from "./constants/apollo"

configDotenv()

const startServer = async () => {
    const app = express()

    await connectDB(process.env.MONGODB_URI as string)
    
    const httpServer = await createApolloServer(app)

    const PORT = process.env.PORT || 14000
    httpServer.listen(PORT, () => {
        console.log(`🚀 Server is running on Port: ${PORT}`);
        console.log("MongoDB URI:", process.env.MONGODB_URI);
    })

}

startServer().catch((error) => {
    console.error("❌ Failed to start the Server", error)
})