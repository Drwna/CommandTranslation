import * as https from 'https';
import * as querystring from 'querystring';
import md5 = require('md5');
import {appId, appSecret} from './private';

const errorMaps = {
  52001: '请求超时',
  52002: '系统错误',
  52003: '未授权用户',
  54000: '必填参数为空',
  54003: '访问频率受限',
  unknown: '服务器繁忙'
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

export const translate = (word) => {
  // console.log('word:', word);

  if (/[a-zA-Z]/.test(word[0])) {
    // 英译中
    from = 'en';
    to = 'zh';
  } else {
    // 中译英
    from = 'zh';
    to = 'en';
  }

  const salt = Math.random();
  const sign = md5(appId + word + salt + appSecret);


  const query: string = querystring.stringify({
    // ?q=blue&from=en&to=zh&appid=20211226001038859&salt=1435660288&sign=ab2bb69563f5815505ebeda5ec4e11d5
    q: word,
    from,
    to,
    appid: appId,
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
      chunks.push(chunk);
    });
    response.on('end', () => {
      const string = Buffer.concat(chunks).toString();
      // console.log(string);
      type BaiduResult = {
        error_code?: string,
        error_msg?: string,
        form: string,
        to: string,
        trans_result: {
          src: string,
          dst: string,
        }[]
      }
      const object: BaiduResult = JSON.parse(string);
      if (object.error_code) {
        console.log(object.error_code);
        if (object.error_code in errorMaps) {
          console.log(errorMaps[object.error_code] || errorMaps[object.error_msg]);
          process.exit(2);
        }
      } else {
        object.trans_result.map(obj => {
          console.log('翻译后: ', obj.dst);
        });
        process.exit(0);// 没有错误
      }
      // console.log(object);
    });
  });

  request.on('error', (e) => {
    console.error(e);
  });
  request.end();
};

