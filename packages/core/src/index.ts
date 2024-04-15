import { STS, STSClient } from '@aws-sdk/client-sts';
import { AwsCredentialIdentity } from '@smithy/types';

require('dotenv').config({
  path: '../../.env',
});

export const sts = new STS({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } as AwsCredentialIdentity,
});
