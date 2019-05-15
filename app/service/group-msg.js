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
                'SELECT g.from_user_id,g.to_group_id,g.message,g.created_at,u.avatar,u.name,u.status FROM group_msg as g inner join user as u on g.from_user_id = u.id where (g.to_group_id = ?) order by g.created_at desc limit ?,?';
            return await this.app.mysql.query(sql, data);
        }
    };
};
