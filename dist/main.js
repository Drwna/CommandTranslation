"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate = void 0;
const https = __importStar(require("https"));
const querystring = __importStar(require("querystring"));
const md5 = require("md5");
const private_1 = require("./private");
const errorMaps = {
    52001: '请求超时',
    52002: '系统错误',
    52003: '未授权用户',
    54000: '必填参数为空',
    54003: '访问频率受限',
    //   if (object.error_code === '52003') {
    //   console.log('用户认证失败');
    // } else if (object.error_code === '52004') {
    //   console.log('...52004');
    // } else if (object.error_code === '52005') {
    //   console.log('...52005');
    // } else if (object.error_code === '52006') {
    //   console.log('...52006');
    // }
};
let from, to;
const translate = (word) => {
    // console.log('word:', word);
    if (/[a-zA-Z]/.test(word[0])) {
        // 英译中
        from = 'en';
        to = 'zh';
    }
    else {
        // 中译英
        from = 'zh';
        to = 'en';
    }
    const salt = Math.random();
    const sign = md5(private_1.appId + word + salt + private_1.appSecret);
    const query = querystring.stringify({
        // ?q=blue&from=en&to=zh&appid=20211226001038859&salt=1435660288&sign=ab2bb69563f5815505ebeda5ec4e11d5
        q: word,
        from,
        to,
        appid: private_1.appId,
        salt: salt,
        sign: sign
    });
    const path = '/api/trans/vip/translate?' + query;
    const options = {
        // hostname: 'www.baidu.com',
        hostname: 'api.fanyi.baidu.com',
        port: 443,
        path: path,
        method: 'GET'
    };
    const request = https.request(options, (response) => {
        const chunks = [];
        response.on('data', (chunk) => {
            // console.log(chunk.constructor);
            chunks.push(chunk);
        });
        response.on('end', () => {
            const string = Buffer.concat(chunks).toString();
            const object = JSON.parse(string);
            if (object.error_code) {
                console.log(object.error_code);
                if (object.error_code in errorMaps) {
                    console.log(errorMaps[object.error_code] || object.error_msg);
                    process.exit(2);
                }
            }
            else {
                object.trans_result.map(obj => {
                    console.log('翻译后: ', obj.dst);
                });
                process.exit(0); // 没有错误
            }
            // console.log(object);
        });
    });
    request.on('error', (e) => {
        console.error(e);
    });
    request.end();
};
exports.translate = translate;
