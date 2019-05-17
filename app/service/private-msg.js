'use strict';
const moment = require('moment');

module.exports = app => {
    return class PrivateMsgService extends app.Service {
        async create({ message, from_user_id, to_user_id }) {
            // 假如 我们拿到用户 id 从数据库获取用户详细信息
            return await this.app.mysql.insert('private_msg', {
                message,
                from_user_id,
                to_user_id,
                created_at: moment().format('YYYY-MM-DD HH:mm:ss')
            });
        }

        /**
         * 获取历史消息列表
         * @param {object} param0 参数
         */
        async getHistoryList({
            from_user_id,
            to_user_id,
            page = 1,
            size = 10
        }) {
            const offset = size * (page - 1);
            const data = [
                from_user_id,
                to_user_id,
                to_user_id,
                from_user_id,
                offset,
                +size
            ];
            const sql =
                'SELECT p.id,p.from_user_id,p.to_user_id,p.message,p.created_at,u.avatar,u.name,u.status FROM private_msg as p inner join user as u on p.from_user_id = u.id where (p.from_user_id = ? AND p.to_user_id = ? ) or (p.from_user_id = ? AND p.to_user_id = ? ) order by p.created_at desc limit ?,?';
            return await this.app.mysql.query(sql, data);
        }

        /**
         * 更新最近阅读时间
         * @param {number} friend_id 好友id
         * @param {number} user_id 用户id
         */
        async updateLatestReadTime(friend_id, user_id) {
            return await this.app.mysql.query(
                'UPDATE user_user_relation SET latest_read_time = ? WHERE friend_id = ? AND user_id = ?',
                [new Date(), friend_id, user_id]
            );
        }
    };
};
