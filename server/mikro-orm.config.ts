import { Options } from '@mikro-orm/core';

import { __db_password__, __db_username__, __prod__ } from './src/constants';

import { Post } from './src/entities/Post';
import { User } from './src/entities/User';

const config: Options = {
    migrations: {
        path: './dist/src/migrations',
        pathTs: './src/migrations',
    },
    entities: [Post, User],
    dbName: 'lireddit',
    user: __db_username__,
    password: __db_password__,
    type: 'postgresql',
    debug: !__prod__,
    allowGlobalContext: true
};

// export default {} as Parameters<typeof MikroORM.init>[0];

export default config;