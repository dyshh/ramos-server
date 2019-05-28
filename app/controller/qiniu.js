'use strict';

const Controller = require('egg').Controller;

class QiniuController extends Controller {
    async getToken() {
        const token = await this.service.qiniu.getToken();
        this.ctx.body = token;
    }
}

module.exports = QiniuController;
