import {
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLNonNull
} from "graphql";
import * as postService from "./post.query.service.js";
import * as postMutation from "./post.mutation.js";

// you will handle the returned data from the service in "type"
export const query = {
    getAllPosts: {
        type: new GraphQLObjectType({
            name: "getAllPosts",
            fields: {
                message: { type: GraphQLString },
                statusCode: { type: GraphQLInt },
                data: {
                    type: new GraphQLList(new GraphQLObjectType({
                        name: "onePostResponse",
                        fields: {
                            _id: { type: GraphQLID },
                            content: { type: GraphQLString },
                            images: {
                                type: new GraphQLList(new GraphQLObjectType({
                                    name: "allImages",
                                    fields: {
                                        secure_url: { type: GraphQLString },
                                        public_id: { type: GraphQLString }
                                    }
                                }))
                            },
                            createdBy: {
                                type: new GraphQLObjectType({
                                    name: "userWhoCreatedPost",
                                    fields: {
                                        _id: { type: GraphQLID },
                                        userName: { type: GraphQLString },
                                        email: { type: GraphQLString },
                                        image: {
                                            type: new GraphQLObjectType({
                                                name: "image",
                                                fields: {
                                                    secure_url: { type: GraphQLString },
                                                    public_id: { type: GraphQLString }
                                                }
                                            })
                                        },
                                        viewers: {
                                            type: new GraphQLList(new GraphQLObjectType({
                                                name: "viewers",
                                                fields: {
                                                    userId: { type: GraphQLID },
                                                    time: { type: GraphQLInt },
                                                }
                                            }))
                                        }
                                    }
                                })
                            },
                            deletedBy: { type: GraphQLID },
                            isDeleted: { type: GraphQLBoolean },
                            likes: { type: new GraphQLList(GraphQLID) },
                        },
                    })),
                },
            },
        }),
        resolve: postService.getAllPosts,
    },
}


export const mutation = {
    likePosts: {
        type: new GraphQLObjectType({
            name: "likePosts",
            fields: {
                message: { type: GraphQLString },
                statusCode: { type: GraphQLInt },
                data: {
                    type: new GraphQLObjectType({  // Instead of GraphQLList
                        name: "onePostLikesResponse",
                        fields: {
                            content: { type: GraphQLString },
                            images: {
                                type: new GraphQLList(new GraphQLObjectType({
                                    name: "Images",
                                    fields: {
                                        secure_url: { type: GraphQLString },
                                        public_id: { type: GraphQLString }
                                    }
                                }))
                            },
                            likes: { type: new GraphQLList(GraphQLID) },
                        },
                    }),
                },
            },
        }),
        args: {
            postId: { type: new GraphQLNonNull(GraphQLID) },
            authorization: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: postMutation.likePost,
    },
}