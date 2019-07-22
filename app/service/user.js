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
    };
};
