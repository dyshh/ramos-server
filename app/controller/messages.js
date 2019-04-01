'use strict';

const Controller = require('egg').Controller;

class MessageController extends Controller {
    async getHistoryList() {
        const {
            group_id: groupId,
        } = this.ctx.params;
        const ret = await this.service.messages.getHistoryList({ groupId });
        this.ctx.body = ret;
    }
}

module.exports = MessageController;
