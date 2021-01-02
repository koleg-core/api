import { Client as MinioClient, ClientOptions, Region } from "minio";
import { urlJoin } from "url-join-ts";

export class S3 {

  private bucketNameCache: string;
  private readonly config: ClientOptions;
  private readonly minioClient: MinioClient;
  // TODO: create metaData from profile picture file uploaded
  private readonly metaData = {
    "Content-Type": "application/octet-stream",
    "X-Amz-Meta-Testing": 1234,
    "example": 5678
  }

  // TODO: replace optional arguments by config set into app.
  constructor(
    private readonly endPoint: string = "",
    private readonly port: number = 443,
    private readonly useSSL: boolean = true,
    private readonly accessKey: string = "",
    private readonly secretKey: string = "",
    private zone: Region = "",
    private bucket: string = "",
    private pathStyle: boolean = false
  ) {
    this.config = {
      endPoint: this.endPoint,
      port: this.port,
      useSSL: this.useSSL,
      accessKey: this.accessKey,
      secretKey: this.secretKey,
      region: this.zone,
      pathStyle: this.pathStyle,
    }, // TODO add type of config model here
    this.minioClient = new MinioClient(this.config);
  }

  public getS3Url(path: string): URL {
    if(!path) {
      throw new Error("Invalid arguments parameters path: string");
    }
    const protocol = this.useSSL ? "https" : "http";
    const baseUrl = this.pathStyle
      ? `${protocol}://${urlJoin(this.endPoint, this.bucket)}`
      : `${protocol}://${this.bucket}.${this.endPoint}`;
    const stringUrl = urlJoin(baseUrl, path);
    console.log(stringUrl);
    return new URL(stringUrl);
  }

  public async uploadContent(data: Buffer, path: string): Promise<void> {
    const error = await this.minioClient.putObject(
      this.bucket,
      path,
      data,
    );
    console.log(error);
  }

  // Scaleway don't support policy
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
            `arn:aws:s3:::${this.bucket}/*`
          ]
        }
      ]
    };
    this.minioClient.setBucketPolicy(
      this.bucket,
      JSON.stringify(publicReadPolicy)
    );
  }
}
