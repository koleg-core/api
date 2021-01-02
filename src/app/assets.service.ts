import {S3} from "infra/s3/S3";


export class AssetsService {

  private s3Client: S3;
  // private vcardClient:

  constructor(s3Client: S3) {
    this.s3Client = s3Client;
  }


  uploadProfilePicture(userId: string, profilePicture: Express.Multer.File): URL {
    if(!profilePicture.mimetype.startsWith("image/")) {
      throw new Error("Invalid file, the profile picture is not a picture.");
    }
    const filePath = `profile-picture/${userId}/${profilePicture.originalname}`;
    const profilePictureDataBuffer = profilePicture.buffer;
    this.s3Client.uploadContent(profilePictureDataBuffer, filePath, profilePicture.mimetype as string).then(() => {
      this.s3Client.setPathPublic(filePath).then(() => console.log("ALO"));
    });

    return this.s3Client.getS3Url(filePath);
  }

  uploadVcards(userId: string, vcard: Buffer): void {
    const filePath = `vcard/${userId}.vcf`;

    this.s3Client.uploadContent(vcard, filePath, "text/plain");
  }
}
