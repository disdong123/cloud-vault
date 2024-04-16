import { GetSessionTokenCommandOutput, STS } from '@aws-sdk/client-sts';
import { AwsCredentialIdentity } from '@smithy/types';

class CredentialProvider {
  private DURATION_SECONDS = 900;
  private sts;

  constructor() {
    this.sts = new STS({
      region: 'ap-northeast-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      } as AwsCredentialIdentity,
    });
  }

  async credentials(): Promise<GetSessionTokenCommandOutput> {
    if (process.env.USER_ROLE_ARN) {
      return this.sts.assumeRole({
        RoleArn: process.env.USER_ROLE_ARN,
        RoleSessionName: 'local-credentials',
        DurationSeconds: this.DURATION_SECONDS,
      });
    }

    return this.sts.getSessionToken({
      DurationSeconds: this.DURATION_SECONDS,
    });
  }
}

export const credentialProvider = new CredentialProvider();
