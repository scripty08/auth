import passportLocalMongoose from 'passport-local-mongoose';
import sessions from 'client-sessions';
import { AuthSchema } from './AuthModel';
import passport from 'passport';

export const applyMongoStrategy = (server, router, mongoose) => {
    server.use(sessions({
        cookieName: 'session',
        secret: 'your-secret',
        duration: 24 * 60 * 60 * 1000 // 24 hours
    }));

    const Schema = new mongoose.Schema(AuthSchema);

    Schema.plugin(passportLocalMongoose);

    delete mongoose.connection.models['admin_users'];
    const model = mongoose.model('admin_users', Schema);

    passport.use(model.createStrategy());
    passport.serializeUser(model.serializeUser());
    passport.deserializeUser(model.deserializeUser());
    server.use(passport.initialize());
    server.use(passport.session());
};
