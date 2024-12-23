import { ApolloServer } from '@apollo/server'
import { makeExecutableSchema } from '@graphql-tools/schema'
import http from "http"
import { WebSocketServer } from "ws"
import { useServer } from 'graphql-ws/lib/use/ws'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { resolvers } from "../graphql/resolvers/index"
import { typeDefs } from '../graphql/schema/index'
// export const createApolloServer = async (httpServer: any, app: any) => {
export const createApolloServer = async (app: any) => {
    const schema = makeExecutableSchema({resolvers , typeDefs })

    // Http and WebSocket Servers
    const httpServer = http.createServer(app);

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql'
    })

    const serverCleanup = useServer({ schema }, wsServer)

    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose()
                        },
                    }
                },
            },
        ],
    })

    await server.start()
    
    return httpServer
}