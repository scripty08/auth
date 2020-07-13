export const AuthSchema = {
    createAt: String,
    firstname: String,
    lastname: String,
    username: String,
    avatar: Object,
    email: String,
    role: String,
    register_date: String,
    last_login: String
};

export const ResponseModel = {
    loggedIn: false,
    firstname: '',
    lastname: '',
    username: '',
    avatar: { url: '' },
    email: '',
    role: 'Visitor',
    url: ''
};
