'use strict';
const qiniu = require('qiniu');
const { accessKey, secretKey, bucket } = require('../secret').qiniu;

module.exports = app => {
    return class QiniuService extends app.Service {
        async getToken() {
            const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
            const options = {
                scope: bucket
            };
            const putPolicy = new qiniu.rs.PutPolicy(options);
            const uploadToken = putPolicy.uploadToken(mac);
            return uploadToken;
        }
    };
};
