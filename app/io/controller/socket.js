'use strict';

const Controller = require('egg').Controller;

class SocketController extends Controller {
    async init() {
        const { ctx } = this;
        const [ userId ] = ctx.args;
        await ctx.service.user.update({
            id: userId,
            socket_id: this.ctx.socket.id,
            status: 1,
        });
    }
}

module.exports = SocketController;

