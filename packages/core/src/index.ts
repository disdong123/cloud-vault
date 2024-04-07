import { STS, STSClient } from '@aws-sdk/client-sts';
require('dotenv').config({
  path: '../../.env',
});

export const sts = new STS({
  region: 'ap-northeast-2',
});

(async () => {
  console.log(await sts.getSessionToken());
})();
