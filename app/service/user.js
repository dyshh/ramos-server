'use strict';
const { omit } = require('lodash');

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
        async update(params) {
            // 假如 我们拿到用户 id 从数据库获取用户详细信息
            return await this.app.mysql.update(
                this.TABLE_NAME,
                JSON.parse(JSON.stringify(omit(params, ['id']))),
                {
                    where: {
                        id: params.id
                    }
                }
            );
        }
        async select(params) {
            return await this.app.mysql.select(this.TABLE_NAME, { ...params });
        }
    };
};
