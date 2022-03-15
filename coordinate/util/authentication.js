const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

module.exports.authentication = (context) => {
    const token = context.req.headers.authorization || ''
    console.log(token);
    if (token) {
        try {
            let user = jwt.verify(token, JWT_SECRET);
            return user;
        } catch (error) {
            throw new Error('Invalid/Expired Token');
        }
    }
    throw new Error('Access Denied. No Token');
}