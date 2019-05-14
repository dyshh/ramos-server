'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

class ChatController extends Controller {
    async getChatList() {
        // 返回默认群
        const getDefaultGroup = async () => {
            const defaultGroup = await this.ctx.service.chat.getDefaultGroup();
            return {
                data: {
                    groups: defaultGroup
                }
            };
        };
        const { id: userid, exp } = this.ctx.service.auth.decodeToken();
        if (userid) {
            // token过期返回默认群
            if (moment().unix() > exp) {
                this.ctx.body = await getDefaultGroup();
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
            this.ctx.body = await getDefaultGroup();
        }
    }
}

module.exports = ChatController;
