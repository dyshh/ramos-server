'use strict';
const moment = require('moment');
module.exports = app => {
    return class UserService extends app.Service {
        async create({ message, from_user_id, to_group_id }) {
            // 假如 我们拿到用户 id 从数据库获取用户详细信息
            return await this.app.mysql.insert('group_msg', {
                message,
                from_user_id,
                to_group_id,
                created_at: moment().format('YYYY-MM-DD hh:mm:ss'),
            });
        }

        async getHistoryList({
            groupId,
        }) {
            const ret = await this.app.mysql.select('group_msg', {
                where: {
                    to_group_id: groupId,
                },
            });
            return ret;
        }
    };
};
