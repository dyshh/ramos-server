'use strict';
const { sample } = require('lodash');

module.exports = app => {
    return class AvatarService extends app.Service {
        /**
         * 随机分配头像
         * @param {number} type 0：群聊 1：私聊
         */
        async giveRandomAvatar(type) {
            const unUsedAvatars = await this.app.mysql.select('avatar', {
                where: {
                    is_use: 0,
                    type
                }
            });
            if (!sample(unUsedAvatars)) {
                return '';
            }
            const { id, address } = sample(unUsedAvatars);
            await this.app.mysql.update(
                'avatar',
                {
                    is_use: 1
                },
                {
                    where: {
                        id
                    }
                }
            );
            return address;
        }
    };
};
