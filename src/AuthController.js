import { AuthPresenter } from './AuthPresenter.js';
import { applyMongoStrategy } from './MongoStrategy.js';
import passport from 'passport';
import { AuthRepository } from './AuthRepository';

export class AuthController {

    constructor(options) {
        this.requestSchema = options.request;
        this.responseSchema = options.response;
        this.responseSchema = options.response;
        this.passport = passport;
    }

    init(server, router, mongoose) {
        applyMongoStrategy(server, router, mongoose);
        router.post('/users/login', this.loginAction.bind(this, mongoose));
        router.post('/users/logout', this.logoutAction.bind(this, mongoose));
        router.post('/users/register', this.registerAction.bind(this, mongoose));
        router.post('/users/forgotPassword', this.forgotPasswordAction.bind(this, mongoose));
        router.post('/users/resetPassword', this.resetPasswordAction.bind(this, mongoose));
        server.use(router);
    }

    loginAction(req, res, mongoose) {
        const presenter = new AuthPresenter(res, this.responseSchema);
        const repository = new AuthRepository(this.requestSchema, mongoose);
        return repository.login(req, this.passport, presenter);
    };

    logoutAction(req, res, mongoose) {
        const presenter = new AuthPresenter(res, this.responseSchema);
        const repository = new AuthRepository(this.requestSchema, mongoose);
        return repository.logout(req, presenter);
    };

    registerAction(req, res, mongoose) {
        const presenter = new AuthPresenter(res, this.responseSchema);
        const repository = new AuthRepository(this.requestSchema, mongoose);
        return repository.register(req.body, presenter);
    };

    forgotPasswordAction(req, res, mongoose) {
        const presenter = new AuthPresenter(res, this.responseSchema);
        const repository = new AuthRepository(this.requestSchema, mongoose);
        return repository.forgotPassword(req.body, presenter);
    };

    resetPasswordAction(req, res, mongoose) {
        const presenter = new AuthPresenter(res, this.responseSchema);
        const repository = new AuthRepository(this.requestSchema, mongoose);
        return repository.resetPassword(req.body, presenter);
    };
}
