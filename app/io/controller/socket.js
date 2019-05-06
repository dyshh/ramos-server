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
        const groupList = await ctx.service.group.getGroupsByUserId(userid);
        for (const item of groupList) {
            const { to_group_id } = item;
            ctx.socket.join(to_group_id);
        }
        await this.ctx.service.group.emitLoginStatus(userid);
    }

    async onlineMembers() {
        const [{ group_id }] = this.ctx.args;
        const onlineMembersInThisGroup = await this.ctx.service.group.getOnlineMembersByGroupId(
            group_id
        );
        const nsp = this.app.io.of('/');
        nsp.to(this.ctx.socket.id).emit('group_online_members', {
            group_id,
            list: onlineMembersInThisGroup
        });
    }
}

module.exports = SocketController;
