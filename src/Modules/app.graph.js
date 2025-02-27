import { GraphQLObjectType, GraphQLSchema } from "graphql";
import * as postController from "./Post/graphql/post.graph.controller.js";


export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "socialAppQuery",
        description: "main app query",
        fields: {
            ...postController.query,
        },
    }),

    // mutation: new GraphQLObjectType({
    //     name: "socialAppMutation",
    //     description: "main app mutation",
    //     fields: {
    //         ...postController.mutation,
    //     },
    // }),
});