'use strict';
const jwt = require('jsonwebtoken');
const secret = require('../utils/token');

module.exports = app => {
    return class UserService extends app.Service {
        // 提取token
        decodeToken() {
            const parts = this.ctx.header.authorization.split(' ');
            const scheme = parts[0];
            const token = parts[1];
            if (/^Bearer$/i.test(scheme) && token !== 'null') {
                return jwt.decode(token, secret);
            }
            return {};
        }
    };
};
