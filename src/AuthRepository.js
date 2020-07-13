import { LOGOUT_RESPONSE, LOGIN_RESPONSE, REGISTER_RESPONSE } from './Constants';
import passportLocalMongoose from 'passport-local-mongoose';
import { Email } from './Email';
import { Logger } from '@scripty/logger';
import { getPasswordResetURL, resetPasswordTemplate, usePasswordHashToMakeToken } from './helper';
import jwt from "jsonwebtoken";

export class AuthRepository {

    constructor(requestSchema, mongoose) {
        delete mongoose.connection.models['admin_users'];
        let Schema = new mongoose.Schema(requestSchema);
        Schema.plugin(passportLocalMongoose);
        this.model = mongoose.model('admin_users', Schema);
    }

    login(request, passport, presenter) {
        return passport.authenticate('local', function (err, user) {
            if (err) presenter.presentError(err);
            request.logIn(user, (err) => {
                if (err) presenter.presentError(err);
                presenter.present({ code: LOGIN_RESPONSE, response: user });
            });
        })(request, presenter);
    };

    logout(request, presenter) {
        request.logout();
        presenter.present({ code: LOGOUT_RESPONSE });
    }

    async register(data, presenter) {
        data.role = 'Visitor';
        const response = await this.model.register(data, data.password);
        await presenter.present({ code: REGISTER_RESPONSE, response })
    };

    getParams(data) {
        if (typeof data.username === 'undefined') {
            return { email: data.email };
        }
        return { username: data.username };
    };

    async forgotPassword(data, presenter) {
        const params = this.getParams(data);
        try {
            const response = await this.model.findOne(params);
            const token = usePasswordHashToMakeToken(response);
            const url = getPasswordResetURL(response, token);
            const emailTemplate = resetPasswordTemplate(response, url);
            await Email.send(emailTemplate);
        } catch (e) {
            Logger.warn('Password reset tried with unknown user');
        }
    };

    async resetPassword(data, presenter) {
        const response = await this.model.findOne({ _id: data.userId });
        const secret = response.password + "-" + response.createdAt
        const payload = jwt.decode(data.token, secret);

        if (payload.userId.toString() === response._id.toString()) {
            const sanitizedUser = await this.model.findByUsername(response.username);
            try {
                await sanitizedUser.setPassword(data.password);
                await sanitizedUser.save();
                await presenter.present({ code: '' });
            } catch (err) {
                await presenter.presentError({ code: '' });
            }
        }

    };
}
