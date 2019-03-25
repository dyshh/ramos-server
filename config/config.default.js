/* eslint valid-jsdoc: "off" */

'use strict';

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

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    io: {
      namespace: {
        '/': {
          connectionMiddleware: [
            'connection', // 这个是连接中间件， 只在connection的时候触发
          ],
          packetMiddleware: [], // 这个会在每次消息的时候触发
        },
      },
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
