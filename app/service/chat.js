'use strict';
module.exports = app => {
    return class UserService extends app.Service {
        async getGroupListById({
            uid,
        }) {
            const arr = await this.app.mysql.select('group_user_relation', {
                where: {
                    user_id: uid,
                },
            });
            const ret = await Promise.all(arr.map(item => this.app.mysql.get('group_info', {
                id: item.to_group_id,
            })));
            return ret;
        }
    };
};
