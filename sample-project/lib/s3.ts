
import { Construct } from 'constructs';
//import * as aws from '@cdktf/provider-aws';
import { S3Bucket } from '@cdktf/provider-aws/lib/s3-bucket';
//import { S3BucketOwnershipControls } from '@cdktf/provider-aws/lib/s3-bucket-ownership-controls';
//import { S3BucketNotification, } from '@cdktf/provider-aws/lib/s3-bucket-notification';
//import { S3BucketLifecycleConfiguration } from '@cdktf/provider-aws/lib/s3-bucket-lifecycle-configuration';

import { EnvironmentConfig } from '../envConfig';

export function s3sample(scope: Construct, envConfig: EnvironmentConfig) {


	// 指定した環境名
	const targetEnvironment = `${process.env.ENV_ID}`;

	new S3Bucket(scope, 'S3Bucket', {
		bucket: `sampleproject-${envConfig[targetEnvironment].env}-log`,
	});
}