'use strict';
const { secret } = require('../../utils/token');
const jwt = require('jsonwebtoken');
// 校验token信息
module.exports = function robotMiddleware() {
    return async (ctx, next) => {
        const { socket } = ctx;
        const { token } = socket.handshake.query;
        // 验证token
        try {
            const payload = jwt.verify(token, secret);
            // 更新用户socket信息
            await ctx.service.user.update({
                id: payload.id,
                socket_id: socket.id,
                status: 1,
            });
            // 返回通过登录验证消息
            socket.emit('auth', {
                login: true,
                userInfo: {
                    id: payload.id,
                },
            });

            await next();
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                socket.emit('auth', {
                    login: false,
                });
            }
        }

    };
};
