require("dotenv").config();
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import logger from 'morgan';

// import schema ,{typeDefs,resolvers} from "./schema";
import {typeDefs,resolvers} from "./schema";
import { getUser, protectResolver } from "./users/users.utils";

const PORT = process.env.PORT;
const apollo = new ApolloServer({
  //schema,
  resolvers,
  typeDefs,
  context: async ({ req }) => { return { 
    loggedInUser: await getUser(req.headers.token) ,
    protectResolver,
  } }
});

const app = express();
app.use(logger('tiny'));
app.use('/static',express.static('uploads'));
apollo.applyMiddleware({app}); // Apollo server에 exApp라는 미들웨어를 적용.

app
  .listen({port:PORT} , ()=>{
    console.log(`🚀SERVER NOW RUNNING ON http://localhost:${PORT} ✅`);
});
