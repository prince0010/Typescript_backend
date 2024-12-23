import { ApolloServer } from '@apollo/server'
import { makeExecutableSchema } from '@graphql-tools/schema'
import http from "http"
import { WebSocketServer } from "ws"
import { useServer } from 'graphql-ws/lib/use/ws'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { resolvers } from "../graphql/resolvers/index.js"
import { typeDefs } from '../graphql/schema/index.js'

export const createApolloServer = async (httpServer: any, path: string) => {
        const schema = makeExecutableSchema({ resolvers, typeDefs })
      
        // WebSocket Server for Subscriptions
        const wsServer = new WebSocketServer({
          server: httpServer,
          path,
        })
        const serverCleanup = useServer({ schema }, wsServer)
      
        // Apollo Server Initialization
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
        return server
      }
      