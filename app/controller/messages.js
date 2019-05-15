'use strict';

const Controller = require('egg').Controller;

class MessageController extends Controller {
    /**
     * 返回某个群聊或私聊历史消息
     */
    async getHistoryList() {
        const { id } = this.ctx.params;
        const { type, page, size } = this.ctx.query;
        let ret;
        if (type === '0') {
            // 群聊
            ret = await this.service.groupMsg.getHistoryList({
                groupId: id,
                page,
                size
            });
        } else {
            // 私聊
            const { id: from_user_id } = this.ctx.service.auth.decodeToken();
            ret = await this.service.privateMsg.getHistoryList({
                from_user_id,
                to_user_id: id,
                page,
                size
            });
        }

        this.ctx.body = {
            data: ret
        };
    }
}

module.exports = MessageController;
