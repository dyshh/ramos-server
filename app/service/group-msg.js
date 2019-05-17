'use strict';
const moment = require('moment');

module.exports = app => {
    return class GroupMsgService extends app.Service {
        async create({ message, from_user_id, to_group_id }) {
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
            const data = [groupId, offset, +size];
            const sql =
                'SELECT g.id,g.from_user_id,g.to_group_id,g.message,g.created_at,u.avatar,u.name,u.status FROM group_msg AS g JOIN user AS u ON g.from_user_id = u.id WHERE (g.to_group_id = ?) ORDER BY g.created_at DESC LIMIT ?,?';
            return await this.app.mysql.query(sql, data);
        }

        /**
         * 更新最近阅读时间
         * @param {string} group_id 群id
         * @param {number} user_id 用户id
         */
        async updateLatestReadTime(group_id, user_id) {
            return await this.app.mysql.query(
                'UPDATE group_user_relation SET latest_read_time = ? WHERE to_group_id = ? AND user_id = ?',
                [new Date(), group_id, user_id]
            );
        }
    };
};
