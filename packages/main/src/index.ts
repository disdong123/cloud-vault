import '@disdong/core';
import express from 'express';
import * as net from 'net';
import { sts } from '@disdong/core';
import process from 'child_process';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/latest/meta-data/iam/security-credentials/', (req, res) => {
  console.log('/latest/meta-data/iam/security-credentials/');
  res.send('local-credentials');
});

app.get('/latest/meta-data/instance-id/', (req, res) => {
  console.log('/latest/meta-data/instance-id/');
  res.send('aws-vault');
});

app.get('/latest/meta-data/iam/info/', (req, res) => {
  console.log('/latest/meta-data/iam/info/');
  res.send({ Code: 'Success' });
});

app.get('/latest/dynamic/instance-identity/document', (req, res) => {
  console.log('/latest/dynamic/instance-identity/document');
  res.send({ region: '+ap-northeast-2+' });
});

app.get('/latest/meta-data/iam/security-credentials/local-credentials', async (req, res) => {
  console.log('/latest/meta-data/iam/security-credentials/local-credentials');
  const session = await sts.getSessionToken({
    DurationSeconds: 900,
  });
  res.send({
    Code: 'Success',
    LastUpdated: new Date(),
    Type: 'AWS-HMAC',
    AccessKeyId: session.Credentials?.AccessKeyId,
    SecretAccessKey: session.Credentials?.SecretAccessKey,
    Token: session.Credentials?.SessionToken,
    Expiration: session.Credentials?.Expiration,
  });
});

app.listen(9199, () => {
  console.log('대기중...');
});

const server = net.createServer();

// TODO
// process.exec('ifconfig lo0 alias 169.254.169.254', (error, stdout, stderr) => {
//   if (error) {
//     console.error(error);
//   }
//   console.log('??', stdout);
// });

// server.listen(80, '169.254.169.254', () => {
//   console.log('??');
// });
