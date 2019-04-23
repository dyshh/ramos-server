'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
    async logout() {
        const { ctx, app } = this;
        const nsp = app.io.of('/');
        const [{ userid }] = ctx.args;

        await ctx.service.user.update({
            id: userid,
            status: 0,
            socket_id: null
        });
        nsp.emit('logout');
    }
}

module.exports = UserController;
