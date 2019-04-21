'use strict';

const assert = require('assert');

/**
 * 全局异常捕获
 */
module.exports = function() {
    return async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            ctx.status = 500;
            if (err instanceof assert.AssertionError) {
                ctx.body = {
                    message: err.message,
                    status: 500,
                };
                return;
            }
            ctx.body = `Server Error: ${err.message}`;
        }
    };
};
