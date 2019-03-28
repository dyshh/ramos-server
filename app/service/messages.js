'use strict';
module.exports = app => {
    return class UserService extends app.Service {
        async create(content) {
            // 假如 我们拿到用户 id 从数据库获取用户详细信息
            return await this.app.mysql.insert('message', {
                content,
            });
        }
    };
};
