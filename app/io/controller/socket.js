'use strict';

const Controller = require('egg').Controller;

class SocketController extends Controller {
    /**
     * 用户登录和注册后初始化socket
     */
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

    /**
     * 在线群成员
     */
    async onlineMembers() {
        const [{ group_id }] = this.ctx.args;
        const [onlineMembersInThisGroup, offlineMembersInThisGroup] = [
            await this.ctx.service.group.getMembersByGroupId(group_id, 1),
            await this.ctx.service.group.getMembersByGroupId(group_id, 0)
        ];
        const nsp = this.app.io.of('/');
        nsp.to(this.ctx.socket.id).emit('group_online_members', {
            group_id,
            onlineList: onlineMembersInThisGroup,
            offlineList: offlineMembersInThisGroup
        });
    }
}

module.exports = SocketController;
