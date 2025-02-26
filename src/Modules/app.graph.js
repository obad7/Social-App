import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLSchema
} from "graphql";

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "mineQuery",
        fields: {
            welcome: {
                type: GraphQLString,
                resolve: (parent, args) => {
                    return "Hello World"
                },
            },
        },
    }),
});