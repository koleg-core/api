// import { Client as MinioClient, ClientOptions, Region } from "minio";
import AWS from "aws-sdk";
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
    private readonly port: number,
    private readonly useSSL: boolean,
    private readonly accessKey: string,
    private readonly secretKey: string,
    private readonly region: string,
    private readonly bucket: string,
    private readonly endpoint: string,
    private readonly pathStyle: boolean,
    private readonly apiVersion: string = "v4"
  ) {

    this.config = {
      accessKeyId: this.accessKey,
      secretAccessKey: this.secretKey,
      apiVersion: this.apiVersion,
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
    return new URL(stringUrl);
  }

  public async uploadContent(
    data: Buffer,
    path: string,
    contentType: string,
    visibility: "public-read" | "private"
  ): Promise<number> {
    let returnCode = 0;
    // Interrogation how s3 manage callback
    this.s3Client.putObject({
      Bucket: this.bucket,
      Key: path,
      ACL: visibility,
      Tagging: "public=yes",
      Body: data,
      ContentType: contentType as AWS.S3.ContentType,
    }, (err, data) => {
      console.log(err);
      returnCode = -1;
    });
    return returnCode;
  }

  public removeContent(path: string): number {
    let returnCode = 0;
    // If you don't add callback error not works
    this.s3Client.deleteObject({
      Bucket: this.bucket,
      Key: path
    }, (err) => {
      returnCode = -1;
      console.log(err);
    });

    return returnCode;
  }

  public async getTemporaryPublicUrl(path: string, durationInSeconds = 60): Promise<URL> {
    try {
      const url = await this.s3Client.getSignedUrlPromise("getObject", {
        Bucket: this.bucket,
        Key: path,
        Expires: durationInSeconds
      });
      return new URL(url);
    } catch (err) {
      console.log(err);
    }
  }
}
