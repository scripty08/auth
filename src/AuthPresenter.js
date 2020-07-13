import { LOGIN_RESPONSE, LOGOUT_RESPONSE, REGISTER_RESPONSE } from './Constants';

export class AuthPresenter {
    constructor(response, schema) {
        this.response = response;
        this.schema = schema;
    }

    async present(interactorResponse) {

        const code = interactorResponse.code;
        const response = interactorResponse.response;

        switch (code) {
            case LOGIN_RESPONSE:
                const responseData = {
                    ...this.filter(response),
                    loggedIn: true
                }
                this.response.send({
                    entries: [responseData]
                });
                break;
            case LOGOUT_RESPONSE:
                this.response.send({
                    entries: [this.schema]
                });
                break;
            case REGISTER_RESPONSE:
                this.response.send({
                    entries: [this.filter(response)]
                });
                break;
        }
    };

    filter(response) {
        let merged = {};
        Object.keys(this.schema).forEach((key) => {
            merged[key] = response._doc[key];
        });
        return merged;
    }

    presentError(error) {
        this.response.send(error);
    };
}
