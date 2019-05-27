'use strict';

const Controller = require('egg').Controller;

class QiniuController extends Controller {
    async getToken() {
        this.ctx.body = await this.service.qiniu.getToken();
    }
}

module.exports = QiniuController;
