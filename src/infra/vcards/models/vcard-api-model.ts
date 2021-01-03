// import VCard from "VCard";
import * as vcard from "@covve/easy-vcard";

import {StatelessUser} from "domain/user/StatelessUser";

// TODO:
// Add s3 serializer/and options in organisation service to regen vcards at each user update and store it on s3
// Move this into s3 model
// Create small api model that store vcard url
export class VcardApiModel {
  private vcard: vcard.VCard;

  constructor(
    private readonly statelessUser: StatelessUser,
    private readonly organisationName: string
  ) {
    // IMPORTANT:
    // The class validator fill object after creation,
    // then this constructor is here to external manipulations.
    // For the same reason, we can't throw error into constructor
    // for missing properties.
    this.vcard = new vcard.VCard();

    this.vcard.addFirstName(statelessUser.identity.firstName);
    this.vcard.addLastName(statelessUser.identity.lastName);
    this.vcard.addTitle(statelessUser.job.getName());
    this.vcard.addOrganization(this.organisationName, []);
    this.vcard.addPhoto(statelessUser.profilePictureUrl.toString());
    this.vcard.addEmail(this.statelessUser.identity.email);
    if(this.statelessUser.phoneNumbers) {
      this.statelessUser.phoneNumbers.forEach(
        phoneNumber => {
          this.vcard.addPhone(phoneNumber.value, {type: phoneNumber.type});
        }
      );
    }
    console.log(this.vcard.toString());
  }

  public serializeAsBuffer(): Buffer {
    console.log(this.vcard.toString());
    return Buffer.from(this.vcard.toString(), "utf8");
  }
}
