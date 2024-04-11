import { STS, STSClient } from '@aws-sdk/client-sts';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
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

(async () => {
  const client = new S3Client({
    region: 'ap-northeast-2',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    } as AwsCredentialIdentity,
  });

  const params = {
    /** input parameters */
  };
  const command = new ListBucketsCommand(params);
  try {
    console.log(await client.send(command));
  } catch (e) {
    console.log(e);
  }
})();
