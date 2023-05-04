import { DB_PASSWORD, DB_USERNAME, __prod__ } from './src/constants';

import { Post } from './src/entities/Post';
import { User } from './src/entities/User';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: "postgres",
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: "lireddit2",
    logging: true,
    synchronize: true,
    entities: [Post, User]
})