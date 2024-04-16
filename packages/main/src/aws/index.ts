import express from 'express';
import { AWS_ROLE } from './constants';
import { credentialProvider } from '@disdong/core';

export const router = express.Router();

router.get('/iam/security-credentials', (req, res) => {
  console.log('/iam/security-credentials');
  res.send(AWS_ROLE);
});

router.get('/instance-id', (req, res) => {
  console.log('/instance-id');
  res.send('aws-vault');
});

router.get('/iam/info', (req, res) => {
  console.log('/iam/info');
  res.send({ Code: 'Success' });
});

router.get('/latest/dynamic/instance-identity/document', (req, res) => {
  console.log('/latest/dynamic/instance-identity/document');
  res.send({ region: 'ap-northeast-2' });
});

router.get(`/iam/security-credentials/${AWS_ROLE}`, async (req, res) => {
  console.log(`/iam/security-credentials/${AWS_ROLE}`);

  try {
    const credentials = await credentialProvider.credentials();

    res.send({
      Code: 'Success',
      LastUpdated: new Date(),
      Type: 'AWS-HMAC',
      AccessKeyId: credentials.Credentials?.AccessKeyId,
      SecretAccessKey: credentials.Credentials?.SecretAccessKey,
      Token: credentials.Credentials?.SessionToken,
      Expiration: credentials.Credentials?.Expiration,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      Code: 'Failed',
    });
  }
});
