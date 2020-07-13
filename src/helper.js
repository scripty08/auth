import jwt from "jsonwebtoken";

export const usePasswordHashToMakeToken = (options) => {
    const {
        password: passwordHash,
        _id: userId,
        createdAt
    } = options;

    const secret = passwordHash + '-' + createdAt
    return jwt.sign({ userId }, secret, { expiresIn: 3600 });
};

export const getPasswordResetURL = (user, token) => {
    return `http://auth-package.docker.local/forgot-password/reset/${user._id}/${token}`;
}

export const resetPasswordTemplate = (user, url) => {
    const to = user.email
    const subject = "🌻 Password Reset 🌻"
    const html = `
  <p>Hallo ${user.username},</p>
  <p>Du hast dein Passwort vergessen. Das tut uns leid!</p>
  <p>Aber keine Sorge, mit folgenden Link kannst du ein neues Passwort eingeben:</p>
  <a href=${url}>${url}</a>
  <p> </p>
  <p>Dieser Link ist 1 Stunde gültig.</p>
  <p> </p>
  <p>Mit freundlichen Gruß</p>
  <p>Dein Team!</p>
  `;
    return { to, subject, html }
}

export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login', next);
    }
};
