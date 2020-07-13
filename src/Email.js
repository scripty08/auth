import nodemailer from 'nodemailer';
import { Logger } from '@scripty/logger';
import fs from 'fs';
import path from 'path';

export class Email {

    static init() {
        const configFile = fs.readFileSync(path.resolve() + '/config.json', "utf8");
        const parsedConfig = JSON.parse(configFile);
        const { email } = parsedConfig;

        const {
            host,
            port = 25,
            username,
            password,
            secure = false,
            ignoreTLS = true
        } = email;

        const options = {
            host: host,
            port: port,
            secure:  secure,
            ignoreTLS: ignoreTLS,
            auth: {
                user: username,
                pass: password
            }
        };

        global.transporter = nodemailer.createTransport(options);
    }

    static async send(options) {

        this.init();

        const { from, to, subject, html, attachments = [] } = options;

        try {
            let response = await global.transporter.sendMail({ from, to, subject, html, attachments });
            Logger.info(`email sent to: ${to}`);
            return response;

        } catch (error) {
            Logger.error(`sending email failed. Message: ${error}`);
        }
    };
}
