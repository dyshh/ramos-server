/* eslint valid-jsdoc: "off" */

'use strict';
const { secret } = require('../app/utils/token');
const fs = require('fs');
const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1552570996721_5812';

    // add your middleware config here
    config.middleware = [];
    config.view = {
        defaultViewEngine: 'static',
        mapping: {
            '.html': 'static'
        }
    };
    config.static = {
        prefix: '/'
    };
    config.siteFile = {
        '/favicon.ico': fs.readFileSync(
            path.join(__dirname, '../app/public/favicon.ico')
        )
    };

    // add your user config here
    const userConfig = {
        multipart: {
            mode: 'file'
        },
        io: {
            namespace: {
                '/': {
                    connectionMiddleware: [
                        'connection' // 这个是连接中间件， 只在connection的时候触发
                    ],
                    packetMiddleware: [] // 这个会在每次消息的时候触发
                }
            }
        },

        mysql: {
            // 单数据库信息配置
            client: {
                // host
                host: 'localhost',
                // 端口号
                port: '3306',
                // 用户名
                user: 'root',
                // 密码
                password: 'root',
                // 数据库名
                database: 'chatroom'
            },
            // 是否加载到 app 上，默认开启
            app: true,
            // 是否加载到 agent 上，默认关闭
            agent: false
        },

        jwt: {
            secret
        }
    };

    return {
        ...config,
        ...userConfig
    };
};
