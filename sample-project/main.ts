import { Construct } from "constructs";
import { App, TerraformStack, S3Backend } from 'cdktf';
import { AwsProvider } from "@cdktf/provider-aws/lib/provider";

import * as fs from 'fs';
import * as path from 'path';

import { envConfig } from './envConfig';

const configPath = path.join(__dirname, './', 'cdktf.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const targetEnvironment = `${process.env.ENV_ID}`;


import { s3sample } from './lib/s3';

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // define resources here
    new AwsProvider(this, 'aws', {
      region: config.terraformBackend.s3.region, // Example: 'us-west-2'
      defaultTags: [{
        tags: {
          environment: process.env.ENV_ID || '',
          IaC: 'cdktf',
          BillingGroup: `${config.projectid}/${envConfig[targetEnvironment].env}`
        }
      }]
    });
    // S3 backend configuration
    new S3Backend(this, {
      bucket: config.terraformBackend.s3.bucket,
      key: `cdktf/${process.env.ENV_ID}.tfstate`,
      region: config.terraformBackend.s3.region,
      encrypt: true,
    });

    s3sample(this, envConfig);
  }
}

const app = new App();

for (const envName in envConfig) {
  new MyStack(app, envName);
}

app.synth();
