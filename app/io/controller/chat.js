'use strict';

const Controller = require('egg').Controller;

class ChatController extends Controller {
    async sendMsg() {
        const { ctx, app } = this;
        const nsp = app.io.of('/');
        const [{ message, from_user_id, to_group_id }] = ctx.args;
        // 先写进库
        const { insertId } = await ctx.service.messages.create({
            message,
            from_user_id,
            to_group_id,
        });
        nsp.emit('broadcast', {
            id: insertId,
            message,
            from_user_id,
            to_group_id,
        });
    }
}

module.exports = ChatController;

