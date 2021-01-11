import {S3} from "infra/s3/S3";

export class AssetsService {

  private s3Client: S3;
  // private vcardClient:
  private readonly vcardS3Directory: string = "vcards";
  private readonly profilePictureS3Directory: string = "vcards";

  constructor(s3Client: S3) {
    this.s3Client = s3Client;
  }

  public uploadProfilePicture(userId: string, profilePicture: Express.Multer.File): URL {
    if(!profilePicture.mimetype.startsWith("image/")) {
      throw new Error("Invalid file, the profile picture is not a picture.");
    }
    const filePath = this.getUserProfilePicturePath(userId, profilePicture.originalname);
    const profilePictureDataBuffer = profilePicture.buffer;
    this.s3Client.uploadContent(profilePictureDataBuffer, filePath, profilePicture.mimetype as string, "public-read").then(() => {
      console.log("Profile picture was uploaded");
    });

    return this.s3Client.getS3Url(filePath);
  }

  public uploadVcard(userId: string, vcard: Buffer): URL {

    const filePath = this.getUserVCardPath(userId);
    this.s3Client.uploadContent(vcard, filePath, "text/vcard", "private").then(() => {
      console.log("Vcard was uploaded");
    });
    return this.s3Client.getS3Url(filePath);
  }
  public deleteVcard(userId: string): number {
    const filePath = this.getUserVCardPath(userId);
    return this.s3Client.removeContent(filePath);
  }

  public async getVcardTemporaryUrl(userId: string): Promise<URL> {
    const vcardPath = this.getUserVCardPath(userId);
    const url = await this.s3Client.getTemporaryPublicUrl(vcardPath);
    return url;
  }

  private getUserVCardPath(userId: string): string {
    return `${this.vcardS3Directory}/${userId}.vcf`;
  }
  private getUserProfilePicturePath(userId: string, fileName: string ):  string {
    return `profile-picture/${userId}/${fileName}`;
  }
}
