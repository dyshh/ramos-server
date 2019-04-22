'use strict';

const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');
const secret = require('../utils/token');
const moment = require('moment');

class ChatController extends Controller {
    async getChatList() {
        const { token } = this.ctx.header;
        const getDefaultGroup = async () => {
            const defaultGroup = await this.ctx.service.chat.getDefaultGroup();
            return {
                data: defaultGroup,
                total: defaultGroup.length,
            };
        };
        // 没登录返回默认群
        if (token === 'null') {
            this.ctx.body = await getDefaultGroup();
            return;
        }
        const { id: userid, exp } = jwt.decode(token, secret);
        // token过期返回默认群
        if (moment().unix() > exp) {
            this.ctx.body = await getDefaultGroup();
            return;
        }
        const ret = await this.service.chat.getGroupListById(userid);
        this.ctx.body = {
            data: ret,
            total: ret.length,
        };
    }
}

module.exports = ChatController;
