import { Server, IndexController } from '@scripty/server';
import { Logger } from '@scripty/logger';
import { mongo } from '@scripty/mongo';
import { AuthController } from '../src';
import dotenv from 'dotenv'

const init = async () => {
    Logger.info('server is initializing');
    dotenv.config();

    const server = new Server();

    const mongoConfig = {
        server: process.env.server,
        db: process.env.db,
        user: process.env.user,
        password: process.env.password,
        port: process.env.port || 27017,
        options: {
            "encrypt": true
        }
    }

    const mongoose = await mongo(mongoConfig);

    await server.setDatabase(mongoose)

    await server.addController(
        new AuthController(),
        new IndexController({ title: 'auth' })
    );

    server.start(3007);
};

init().catch((err) => {
    console.error(err.message);
});
