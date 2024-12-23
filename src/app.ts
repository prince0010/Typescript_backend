import express from "express";
import http from "http";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4"
import { configDotenv } from "dotenv";
import { createApolloServer } from "./constants/apollo.js"
import { connectDB } from "./constants/db.js"
import { IAuthRequest } from "./interfaces/auth.js"
import authMiddleware from "./middleware/auth.js"
import { dataSources } from "./graphql/api/index.js"

configDotenv()

const app = express()
const httpServer = http.createServer(app)

app.use(authMiddleware)

const startServer = async () => {
    try {

    await connectDB(process.env.MONGODB_URI as string)

    const apolloServer = await createApolloServer(
        httpServer,
        process.env.GRAPHQL_PATH as string
    )

    app.use(
        process.env.GRAPHQL_PATH as string,
        cors<cors.CorsRequest>(),
        express.json(),
        expressMiddleware(apolloServer, {
            context: async ({ req }: { req: IAuthRequest }) => ({
                authId: req.authId,
                // authRole: req.authRole,
                isAuth: req.isAuth,
                dataSources,
            }),
        })
      )
      httpServer.listen(
        process.env.PORT,
        parseInt(process.env.IP_ADDRESS as string),
        () => {
            console.log(
                `🚀 Backend server ready at ${process.env.IP_ADDRESS}:${process.env.PORT}`
            )
        }
      )
    }catch(error){
    console.error("❌ Error starting server:", error)
    }
}
startServer()