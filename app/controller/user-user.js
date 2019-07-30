'use strict';

const Controller = require('egg').Controller;
const { isEmpty } = require('lodash');

class UserUserController extends Controller {
    /**
     * 主动加好友
     */
    async create() {
        const { friend_id } = this.ctx.request.body;
        const { id } = this.ctx.service.auth.decodeToken();
        const ret = await this.app.mysql.query(
            'SELECT * FROM user_user_relation AS uu WHERE user_id = ? AND friend_id = ?',
            [id, friend_id]
        );
        if (!isEmpty(ret)) {
            this.ctx.throw(400, '对方已经是你的好友');
        }
        await this.app.mysql.insert('user_user_relation', {
            user_id: id,
            friend_id,
            created_at: new Date()
        });
        await this.app.mysql.insert('user_user_relation', {
            user_id: friend_id,
            friend_id: id,
            created_at: new Date()
        });
        const friendInfo = await this.ctx.service.user.findOne({
            id: friend_id
        });
        if (friendInfo.status === 1) {
            // 如果对方在线，发送通知刷新好友列表
            const nsp = this.app.io.of('/');
            nsp.to(friendInfo.socket_id).emit('refresh_chat_list');
        }

        this.ctx.body = {
            data: {}
        };
    }
}

module.exports = UserUserController;
