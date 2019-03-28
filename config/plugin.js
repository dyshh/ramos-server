'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  io: {
    enable: true,
    package: 'egg-socket.io',
  },
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
};
