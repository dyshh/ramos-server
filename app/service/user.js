'use strict';
const { omit } = require('lodash');

module.exports = app => {
    return class UserService extends app.Service {
        async findOne(params) {
            return await this.app.mysql.get('user', { ...params });
        }
        async create(params) {
            return await this.app.mysql.insert('user', params);
        }
        async update(params) {
            return await this.app.mysql.update(
                'user',
                JSON.parse(JSON.stringify(omit(params, ['id']))),
                {
                    where: {
                        id: params.id
                    }
                }
            );
        }
        async select(params) {
            return await this.app.mysql.select('user', { ...params });
        }
        /**
         * 获取所有在线用户
         */
        async getAllOnlineUsers() {
            return await this.select({
                where: {
                    status: 1
                },
                columns: ['id', 'name', 'avatar']
            });
        }
    };
};
