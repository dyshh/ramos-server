'use strict';

module.exports = app => {
    return class UserService extends app.Service {
        async getUserInfoById(id) {
            // 假如 我们拿到用户 id 从数据库获取用户详细信息
            return await this.app.mysql.get('user', {
                id,
            });
        }
    };
};
