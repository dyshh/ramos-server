'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

class ChatController extends Controller {
    async getDefaultGroup() {
        const defaultGroup = await this.ctx.service.chat.getDefaultGroup();
        return {
            data: {
                groups: defaultGroup
            }
        };
    }
    /**
     * 获取会话列表，包括群聊和私聊
     */
    async getChatList() {
        const { id: userid, exp } = this.ctx.service.auth.decodeToken();
        if (userid) {
            // token过期返回默认群
            if (moment().unix() > exp) {
                this.ctx.body = await this.getDefaultGroup();
                return;
            }
            const groups = await this.service.chat.getGroupListById(userid);
            const friends = await this.service.chat.getFriendListById(userid);
            this.ctx.body = {
                data: {
                    groups,
                    friends
                }
            };
        } else {
            // 没登录返回默认群
            this.ctx.body = await this.getDefaultGroup();
        }
    }
}

module.exports = ChatController;
