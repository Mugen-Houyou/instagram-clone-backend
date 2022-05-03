require("dotenv").config();
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import logger from 'morgan';
import { graphqlUploadExpress } from "graphql-upload";

import { createServer, Server } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";

// import schema ,{typeDefs,resolvers} from "./schema";
import schema from "./schema";
import { getUser, protectResolver } from "./users/users.utils";

import pubsub from './pubsub'

console.log("ioaengofnw" + pubsub)

const PORT = process.env.PORT;
const apollo = new ApolloServer({
  schema,
  // resolvers,
  // typeDefs,
  uploads: false,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
      protectResolver,
    }
  },

  plugins: [
    {
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          },
        };
      },
    },
  ],

});

const app = express();
app.use(logger('tiny'));
app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }));
apollo.applyMiddleware({ app }); // Apollo server에 exApp라는 미들웨어를 적용.

//app.use(morgan("dev"));
app.use(graphqlUploadExpress());
app.use("/uploads", express.static("uploads"));
// app.use("/uploads", express.static("uploads"));


const httpServer = createServer(app);
const subscriptionServer = SubscriptionServer.create({ schema, execute, subscribe }, { server: httpServer, path: "/graphql" });

httpServer.listen(
  process.env.PORT, () => console.log(`🚀 Server: http://localhost:${process.env.PORT}${apollo.graphqlPath}`)
);

//https://github.com/GitHubGW/instagram-backend