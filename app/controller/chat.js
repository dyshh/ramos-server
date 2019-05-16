'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');
const { isEmpty } = require('lodash');

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
    /**
     * 搜索群和用户
     */
    async searchUsersAndGroups() {
        const { keyword } = this.ctx.request.query;
        const ret = {};
        if (!keyword) {
            this.ctx.body = {
                data: ret,
                total: 0
            };
            return;
        }
        // 查用户表
        const userRet = await this.app.mysql.query(
            `select id, name, avatar from user where name like '%${keyword}%'`
        );
        if (!isEmpty(userRet)) {
            ret.users = userRet;
        }
        // 查群表
        const groupRet = await this.app.mysql.query(
            `select * from group_info where name like '%${keyword}%'`
        );
        if (!isEmpty(groupRet)) {
            ret.groups = groupRet;
        }
        this.ctx.body = {
            data: ret,
            total: userRet.length + groupRet.length
        };
    }
}

module.exports = ChatController;
