'use strict';
const jwt = require('jsonwebtoken');
const secret = 'token';

exports.secret = secret;

exports.generateToken = function generateToken(userid) {
    const token = jwt.sign(
        {
            id: userid
        },
        secret,
        { expiresIn: '3d' }
    );
    return token;
};
