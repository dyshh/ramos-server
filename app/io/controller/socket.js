'use strict';

const Controller = require('egg').Controller;

class SocketController extends Controller {
    async init() {
        const { ctx } = this;
        const [{ userid }] = ctx.args;

        // 更新用户表登录状态
        await ctx.service.user.update({
            id: userid,
            status: 1,
            socket_id: ctx.socket.id
        });
        const groupList = await this.ctx.service.chat.getGroupListById(userid);
        for (const item of groupList) {
            ctx.socket.join(item.id);
        }
    }
}

module.exports = SocketController;
