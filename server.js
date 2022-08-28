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
  context: async (ctx) => { // 이 context는 http의 context일 수도, ws의 context일 수도 있음.
    if (ctx.req) {// context가 http랑 ws랑 둘 다 작동할 수 있어야. req는 http만 있으므로.
      return { loggedInUser: await getUser(ctx.req.headers.token), }
    } else {
      const { connection: { context }, } = ctx;
      return { loggedInUser: context.loggedInUser };
    }
  },

  plugins: [
    {
      async serverWillStart() {
        return { async drainServer() { subscriptionServer.close(); }, };
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
const subscriptionServer = SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe,
    // onConnect는 ws에 연결할 때 딱 한번만 호출됨. 
    onConnect: async ({ token }) => {  // resolvers의 context에서 token을 뽑아옴.
      if (!token) throw new Error("You can't listen.");
      const loggedInUser = await getUser(token);
      return { loggedInUser };
    }, // websocket의 세상에는 request가 없다. 그러므로 onConnect에서 
    onDisconnect(webSocket, context) {
      console.log("Disconnected!");
    },
  },
  { server: httpServer, path: "/graphql" }
);

httpServer.listen(
  process.env.PORT, () => console.log(`🚀 Server: http://localhost:${process.env.PORT}${apollo.graphqlPath}`)
);
// 이제는 http서버 상에서 listen중임. 큰 차이는 없지만.

//https://github.com/GitHubGW/instagram-backend