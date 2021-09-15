const config = require('config.json');
const jwt = require('jsonwebtoken');

// users hardcoded for simplicity, store in a db for production applications
let users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

for (i = 2; i < 20; i++) {
    users.push({ 
        id: i, 
        username: 'test' + i, 
        password: 'test' + i, 
        firstName: 'Test' + i, 
        lastName: 'User' + i 
    });
}

module.exports = {
    authenticate,
    getAll
};

async function authenticate({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) throw 'Username or password is incorrect';

    // create a jwt token that is valid for 7 days
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: 60 });

    return {
        ...omitPassword(user),
        token
    };
}

async function getAll({ page, pageSize }) {

    return paginate(users.map(u => omitPassword(u)), pageSize, page);
    // return users.map(u => omitPassword(u));
}

// helper functions

function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

function paginate(array, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}