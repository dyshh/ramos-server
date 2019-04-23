'use strict';

module.exports = app => {
    return class UserService extends app.Service {
        get TABLE_NAME() {
            return 'user';
        }
        async findOne(params) {
            return await this.app.mysql.get(this.TABLE_NAME, { ...params });
        }
        async create(params) {
            return await this.app.mysql.insert(this.TABLE_NAME, params);
        }
        async update({ id, status, socket_id }) {
            // 假如 我们拿到用户 id 从数据库获取用户详细信息
            return await this.app.mysql.update(
                this.TABLE_NAME,
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
