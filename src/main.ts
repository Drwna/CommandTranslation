import * as https from 'https';
import * as querystring from 'querystring';
import md5 = require('md5');
import {appId, appSecret} from './private';

export const translate = (word) => {
  console.log('word:', word);

  const salt = Math.random();
  const sign = md5(appId + word + salt + appSecret);


  const query: string = querystring.stringify({
    // ?q=blue&from=en&to=zh&appid=20211226001038859&salt=1435660288&sign=ab2bb69563f5815505ebeda5ec4e11d5
    q: word,
    from: 'en',
    to: 'zh',
    appid: appId + 1,
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
      console.log(string);
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
        console.log(object.error_msg);

        process.exit(2);
      } else {
        console.log('翻译后: ', object.trans_result[0].dst);
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

