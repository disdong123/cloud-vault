import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { AwsCredentialIdentity } from '@smithy/types';

require('dotenv').config({
  path: '../../.env',
});

describe('iam user 를 통해 s3 에 접근할 때', () => {
  const command = new ListBucketsCommand({});

  test('user 에 권한이 부여되어 있으면 정상적으로 응답을 반환한다.', async () => {
    const client = new S3Client({
      region: 'ap-northeast-2',
      credentials: {
        accessKeyId: process.env.USER_WITH_POLICY_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.USER_WITH_POLICY_AWS_SECRET_ACCESS_KEY,
      } as AwsCredentialIdentity,
    });

    expect(async () => await client.send(command)).not.toThrow();
  });

  test('user 에 권한이 부여되어 있지 않으면 access denied 에러가 발생한다.', async () => {
    const client = new S3Client({
      region: 'ap-northeast-2',
      credentials: {
        accessKeyId: process.env.USER_WITHOUT_POLICY_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.USER_WITHOUT_POLICY_AWS_SECRET_ACCESS_KEY,
      } as AwsCredentialIdentity,
    });

    expect(async () => await client.send(command)).rejects.toThrowError();
  });
});
