'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
    // 断线，如关闭浏览器、断网等
    async disconnect() {
        const { ctx } = this;
        const user = await ctx.service.user.findOne({
            socket_id: ctx.socket.id
        });
        if (user) {
            await ctx.service.user.update({
                id: user.id,
                status: 0,
                socket_id: null
            });
        }
    }
}

module.exports = UserController;
