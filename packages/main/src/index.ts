require('dotenv').config({
  path: '../../.env',
});

import '@disdong/core';
import express from 'express';
import { credentialProvider } from '@disdong/core';
import cprocess from 'child_process';
import { AWS_ROLE } from './aws/constants';
import { router as awsRouter } from './aws';

const app = express();

app.use('/latest/meta-data', awsRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

cprocess.exec('ifconfig lo0 alias 169.254.169.254', (error, stdout, stderr) => {
  if (error) {
    console.error(error);
  }

  console.log('ifconfig done...');

  app.listen(80, '169.254.169.254', () => {
    console.log('169.254.169.254:80 listening...');
  });
});
