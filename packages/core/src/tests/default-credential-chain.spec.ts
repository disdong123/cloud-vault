import { describe } from 'node:test';
import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { defaultProvider } from '@aws-sdk/credential-provider-node';

describe('Default credentials chain provider 테스트', () => {
  const command = new ListBucketsCommand({});

  test('simple test', async () => {
    const client = new S3Client({
      region: 'ap-northeast-2',
      credentialDefaultProvider: defaultProvider() as any,
    });

    expect(async () => await client.send(command)).not.toThrow();
  });
});
