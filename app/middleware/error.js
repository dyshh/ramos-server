'use strict';

const assert = require('assert');

module.exports = function() {
    return async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            if (err instanceof assert.AssertionError) {
                ctx.status = 500;
                ctx.body = {
                    message: err.message,
                    status: 500,
                };
                return;
            }
        }
    };
};
