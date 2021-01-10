import * as vcard from "@covve/easy-vcard";
import { Job } from "domain/user/Job";
import { StatelessUser } from "domain/user/StatelessUser";

// import {StatelessUser} from "domain/user/StatelessUser";

// TODO:
// Add s3 serializer/and options in organisation service to regen vcards at each user update and store it on s3
// Move this into s3 model
// Create small api model that store vcard url
export class VcardApiModel {
  private vcard: vcard.VCard;

  constructor(
    private readonly statelessUser: StatelessUser,
    private readonly organisationName: string,
    private readonly job: Job
  ) {
    // IMPORTANT:
    // The class validator fill object after creation,
    // then this constructor is here to external manipulations.
    // For the same reason, we can't throw error into constructor
    // for missing properties.
    this.vcard = new vcard.VCard();

    this.vcard.addFirstName(statelessUser.identity.firstName);
    this.vcard.addLastName(statelessUser.identity.lastName);
    if(this.job) {
      this.vcard.addTitle(this.job.getName());
    }
    this.vcard.addOrganization(this.organisationName, []);
    if(statelessUser.profilePictureUrl) {
      this.vcard.addPhoto(statelessUser.profilePictureUrl.toString());
    }
    this.vcard.addEmail(this.statelessUser.identity.email);
    if(this.statelessUser.phoneNumbers) {
      this.statelessUser.phoneNumbers.forEach(
        phoneNumber => {
          this.vcard.addPhone(phoneNumber.value, {type: phoneNumber.type});
        }
      );
    }
  }

  public serializeAsBuffer(): Buffer {
    return Buffer.from(this.vcard.toString(), "utf8");
  }
}
