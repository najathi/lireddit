import "reflect-metadata";
import "dotenv-safe/config";
import express from 'express'
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import { AppDataSource } from './../typeorm.config';
import { COOKIE_NAME, __port__, __prod__ } from "./constants";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import { HelloResolver } from './resolvers/hello';
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

import session from "express-session"
import Redis from "ioredis"
import RedisStore from "connect-redis"

import cors from 'cors'

import { MyContext } from "./types";

const main = async () => {

    await AppDataSource.initialize();

    const app = express()

    const redisClient = new Redis();

    let redisStore = new RedisStore({
        client: redisClient,
        disableTouch: true
    })

    app.use(
        cors({
            origin: 'http://localhost:3000',
            credentials: true
        })
    );

    app.use(
        session({
            name: COOKIE_NAME,
            store: redisStore,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true, // javascript code frontend, you can't access the cookie
                sameSite: 'lax', // csrf
                secure: __prod__, // cookie only works in https
            },
            resave: false, // required: force lightweight session keep alive (touch)
            secret: "wqekuwkfkscjvhxzggckzsjlbkh",
            saveUninitialized: false, // recommended: only save session when data exists
        })
    )
    // ! please set this, otherwise will not work
    // graphiql -> settings -> "request.credentials": "omit" -> save settings

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                HelloResolver,
                PostResolver,
                UserResolver
            ],
            validate: false,
        }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
        context: ({ req, res }): MyContext => ({
            req,
            res,
            redis: redisClient
        })
    });

    await apolloServer.start()
    apolloServer.applyMiddleware({
        app,
        cors: false
    });
    app.listen(__port__, () => {
        console.log(`🚀 Server ready and listening at ==> http://localhost:${__port__}${apolloServer.graphqlPath}`);
    });
}

main().catch(err => {
    console.error(err)
});

