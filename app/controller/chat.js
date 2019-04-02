'use strict';

const Controller = require('egg').Controller;

class ChatController extends Controller {
    async getChatList() {
        const {
            uid,
        } = this.ctx.params;
        const ret = await this.service.chat.getGroupListById({ uid });
        this.ctx.body = ret;
    }
}

module.exports = ChatController;
