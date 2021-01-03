// import { Client as MinioClient, ClientOptions, Region } from "minio";
import AWS from "aws-sdk";
import {ContentType} from "aws-sdk/clients/cloudsearchdomain";
import { urlJoin } from "url-join-ts";

export class S3 {

  private readonly config: AWS.S3.ClientConfiguration;
  private readonly s3Client: AWS.S3;
  // TODO: create metaData from profile picture file uploaded
  // private readonly metaData = {
  //   "Content-Type": "application/octet-stream",
  //   "X-Amz-Meta-Testing": 1234,
  //   "example": 5678
  // }

  // TODO: replace optional arguments by config set into app.
  constructor(
    private readonly port: number = 443,
    private readonly useSSL: boolean = true,
    private readonly accessKey: string = "SCWB68DF4N2GG4P3E1Y8",
    private readonly secretKey: string = "5564d38e-8c9d-4f91-a569-00877a4d37ad",
    private readonly region: string = "fr-par",
    private readonly bucket: string = "koleg-public",
    private readonly endpoint: string = `s3.${region}.scw.cloud`,
    private readonly pathStyle: boolean = false
  ) {

    this.config = {
      accessKeyId: this.accessKey,
      secretAccessKey: this.secretKey,
      apiVersion: "v4",
      region: this.region,
      sslEnabled: this.useSSL,
      endpoint: this.endpoint,
      s3ForcePathStyle: pathStyle
    };
    this.s3Client = new AWS.S3(this.config);
  }

  public getS3Url(path: string): URL {
    if(!path) {
      throw new Error("Invalid arguments parameters path: string");
    }
    const protocol = this.useSSL ? "https" : "http";
    const baseUrl = this.pathStyle
      ? `${protocol}://${urlJoin(this.endpoint, this.bucket)}`
      : `${protocol}://${this.bucket}.${this.endpoint}`;
    const stringUrl = urlJoin(baseUrl, path);
    console.log(stringUrl);
    return new URL(stringUrl);
  }

  public async uploadContent(data: Buffer, path: string, contentType: string): Promise<void> {
    this.s3Client.putObject({
      Bucket: this.bucket,
      Key: path,
      ACL: "public-read",
      Tagging: "public=yes",
      Body: data,
      ContentType: contentType as AWS.S3.ContentType,
    }, (err, data) => {
      console.log("AMAZON", err, data);
    });
  }

  public async setPathPublic(path: string): Promise<void> {
    const publicReadPolicy = {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [
            "s3:GetObject"
          ],
          "Resource": [
            `arn:aws:s3:::${this.bucket}/${path}`
          ]
        }
      ]
    };
    const bucketPolicyParams = {
      Bucket: this.bucket,
      Policy: JSON.stringify(publicReadPolicy)
    };
    this.s3Client.putBucketPolicy(bucketPolicyParams);
  }

  public async setPathPrivate(path: string): Promise<void> {
    const publicReadPolicy = {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Deny",
          "Action": [
            "s3:GetObject"
          ],
          "Resource": [
            `arn:aws:s3:::${this.bucket}/${path}`
          ]
        }
      ]
    };
    const bucketPolicyParams = {
      Bucket: this.bucket,
      Policy: JSON.stringify(publicReadPolicy)
    };
    this.s3Client.putBucketPolicy(bucketPolicyParams);
  }
}
