import * as https from 'https';
import * as querystring from 'querystring';
import md5 = require('md5');

export const translate = (word) => {
  console.log('word:', word);

  const appId = 'xxx';
  const appSecret = '???';
  const salt = Math.random();
  const sign = md5(appId + word + salt + appSecret);


  const query: string = querystring.stringify({
    // ?q=blue&from=en&to=zh&appid=20211226001038859&salt=1435660288&sign=ab2bb69563f5815505ebeda5ec4e11d5
    q: word,
    from: 'en',
    to: 'zh',
    appid: appId,
    salt: salt,
    sign: sign
  });

  const path = '/api/trans/vip/translate?' + query;

  const options = {
    // hostname: 'www.baidu.com',
    hostname: 'api.fanyi.baidu.com/',
    port: 443,
    path: path,
    method: 'GET'
  };

  const req = https.request(options, (res) => {

    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  req.on('error', (e) => {
    console.error(e);
  });
  req.end();
};

