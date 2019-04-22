'use strict';

const Controller = require('egg').Controller;

class MessageController extends Controller {
    async getHistoryList() {
        const {
            group_id: groupId,
        } = this.ctx.params;
        const { page, size } = this.ctx.query;
        const messages = await this.service.messages.getHistoryList({ groupId, page, size });
        const ret = await Promise.all(messages.map(async item => {
            const { from_user_id } = item;
            const { name } = await this.service.user.findOne({ id: from_user_id });
            return {
                ...item,
                username: name,
            };
        }));
        this.ctx.body = {
            data: ret,
            total: ret.length,
        };
    }
}

module.exports = MessageController;
