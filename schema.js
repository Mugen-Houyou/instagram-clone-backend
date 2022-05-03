// import {
//   loadFilesSync,
//   makeExecutableSchema,
//   mergeResolvers,
//   mergeTypeDefs,
// } from "graphql-tools";


// const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
// const loadedResolvers = loadFilesSync(`${__dirname}/**/*.resolvers.js`);

// export const typeDefs = mergeTypeDefs(loadedTypes);
// export const resolvers = mergeResolvers(loadedResolvers);

// // const schema = makeExecutableSchema({ typeDefs, resolvers });
// // export default schema;import { loadFilesSync } from "@graphql-tools/load-files";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { IResolvers } from "@graphql-tools/utils";
import { DocumentNode, GraphQLSchema } from "graphql";

const typeDefsArray = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
const resolversArray = loadFilesSync(`${__dirname}/**/*.resolvers.js`);

const mergedTypeDefs = mergeTypeDefs(typeDefsArray);
const mergedResolvers = mergeResolvers(resolversArray);

const schema = makeExecutableSchema({ typeDefs:mergedTypeDefs, resolvers:mergedResolvers });

export default schema;