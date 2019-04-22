'use strict';

module.exports = app => {
    return class UserService extends app.Service {
        async findOne(params) {
            return await this.app.mysql.get('user', { ...params });
        }
        async update({ id, status, socket_id }) {
            // 假如 我们拿到用户 id 从数据库获取用户详细信息
            return await this.app.mysql.update(
                'user',
                {
                    status,
                    socket_id
                },
                {
                    where: {
                        id
                    }
                }
            );
        }
    };
};
