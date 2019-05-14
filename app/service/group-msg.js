'use strict';
const moment = require('moment');

module.exports = app => {
    return class GroupMsgService extends app.Service {
        async create({ message, from_user_id, to_group_id }) {
            console.log(message, from_user_id, to_group_id);
            // 假如 我们拿到用户 id 从数据库获取用户详细信息
            return await this.app.mysql.insert('group_msg', {
                message,
                from_user_id,
                to_group_id,
                created_at: moment().format('YYYY-MM-DD HH:mm:ss')
            });
        }

        /**
         * 获取历史消息列表
         * @param {object} param0 参数
         */
        async getHistoryList({ groupId, page = 1, size = 10 }) {
            const offset = size * (page - 1);
            const ret = await this.app.mysql.select('group_msg', {
                where: {
                    to_group_id: groupId
                },
                orders: [['created_at', 'desc']],
                limit: +size,
                offset: +offset
            });
            return ret;
        }
    };
};
