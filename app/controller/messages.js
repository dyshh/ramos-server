'use strict';

const Controller = require('egg').Controller;

class MessageController extends Controller {
    /**
     * 返回某个群聊或私聊历史消息
     */
    async getHistoryList() {
        const { id } = this.ctx.params;
        const { type, page, size } = this.ctx.query;
        const { id: from_user_id } = this.ctx.service.auth.decodeToken();
        let ret;
        if (type === '0') {
            // 群聊
            ret = await this.service.groupMsg.getHistoryList({
                groupId: id,
                page,
                size
            });
            // 更新最近阅读时间，为了做未读消息
            await this.service.groupMsg.updateLatestReadTime(id, from_user_id);
        } else {
            // 私聊
            ret = await this.service.privateMsg.getHistoryList({
                from_user_id,
                to_user_id: id,
                page,
                size
            });
            await this.service.privateMsg.updateLatestReadTime(
                id,
                from_user_id
            );
        }

        this.ctx.body = {
            data: ret
        };
    }
}

module.exports = MessageController;
