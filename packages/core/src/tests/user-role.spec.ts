import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { AwsCredentialIdentity } from '@smithy/types';
import { STS } from '@aws-sdk/client-sts';

require('dotenv').config({
  path: '../../.env',
});

describe('iam user 가 어떠한 권한도 가지고 있지 않고', () => {
  const command = new ListBucketsCommand({});

  test('특정 리소스에 권한이 있는 role 에 trust relationship 설정이 되어있고, 이 role 을 assume 하면 해당 리소스에 접근할 수 있다.', async () => {
    const stsClient = new STS({
      region: 'ap-northeast-2',
      credentials: {
        accessKeyId: process.env.USER_ROLE_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.USER_ROLE_AWS_SECRET_ACCESS_KEY,
      } as AwsCredentialIdentity,
    });

    const token = await stsClient.assumeRole({
      RoleArn: process.env.USER_ROLE_ARN,
      RoleSessionName: 'test',
      DurationSeconds: 900,
    });

    const client = new S3Client({
      region: 'ap-northeast-2',
      credentials: {
        accessKeyId: token.Credentials?.AccessKeyId,
        secretAccessKey: token.Credentials?.SecretAccessKey,
        sessionToken: token.Credentials?.SessionToken,
      } as AwsCredentialIdentity,
    });

    console.log(await client.send(command));
  });

  test('role 에 trust relationship 설정이 되어있지 않으면, 이 role 을 assume 할 때 access denied 에러가 발생한다.', async () => {
    const stsClient = new STS({
      region: 'ap-northeast-2',
      credentials: {
        accessKeyId: process.env.USER_WITH_POLICY_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.USER_WITH_POLICY_AWS_SECRET_ACCESS_KEY,
      } as AwsCredentialIdentity,
    });

    expect(
      async () =>
        await stsClient.assumeRole({
          RoleArn: process.env.USER_ROLE_ARN,
          RoleSessionName: 'test',
          DurationSeconds: 900,
        }),
    ).rejects.toThrow();
  });
});
