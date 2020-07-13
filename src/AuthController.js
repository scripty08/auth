import { AuthPresenter } from './AuthPresenter.js';
import { initMongoStrategy } from './MongoStrategy.js';
import passport from 'passport';
import { AuthRepository } from './AuthRepository';

export class AuthController {

    static requestSchema = {
        username: String,
        password: String
    }

    static responseSchema = {
        username: String,
        password: String
    }

    static collection = 'admin_users'

    init(server, router) {
        initMongoStrategy(server);
        this.db = server.db;
        this.repository = new AuthRepository(AuthController.requestSchema, this.db, AuthController.collection);

        router.post('/users/login', this.loginAction.bind(this));
        router.post('/users/logout', this.logoutAction.bind(this));
        router.post('/users/register', this.registerAction.bind(this));
        router.post('/users/forgotPassword', this.forgotPasswordAction.bind(this));
        router.post('/users/resetPassword', this.resetPasswordAction.bind(this));
        server.use(router);
    }

    loginAction(req, res) {
        const presenter = new AuthPresenter(res, AuthController.responseSchema);
        return this.repository.login(req, passport, presenter);
    };

    logoutAction(req, res) {
        const presenter = new AuthPresenter(res, AuthController.responseSchema);
        return this.repository.logout(req, presenter);
    };

    registerAction(req, res) {
        const presenter = new AuthPresenter(res, AuthController.responseSchema);
        return this.repository.register(req.body, presenter);
    };

    forgotPasswordAction(req, res) {
        const presenter = new AuthPresenter(res, AuthController.responseSchema);
        return this.repository.forgotPassword(req.body, presenter);
    };

    resetPasswordAction(req, res) {
        const presenter = new AuthPresenter(res, AuthController.responseSchema);
        return this.repository.resetPassword(req.body, presenter);
    };
}
