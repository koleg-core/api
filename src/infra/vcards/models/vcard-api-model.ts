import { VCard } from "vcard-creator";

import {StatelessUser} from "domain/user/StatelessUser";

// TODO:
// Add s3 serializer/and options in organisation service to regen vcards at each user update and store it on s3
// Move this into s3 model
// Create small api model that store vcard url
export class VcardApiModel {
  private vcard: VCard = new VCard();

  constructor(
    private readonly statelessUser: StatelessUser,
    private readonly organisationName: string
  ) {
    // IMPORTANT:
    // The class validator fill object after creation,
    // then this constructor is here to external manipulations.
    // For the same reason, we can't throw error into constructor
    // for missing properties.

    this.vcard.addName(
      this.statelessUser.identity.lastName,
      this.statelessUser.identity.firstName
    );
    this.vcard.addCompagny(this.organisationName);
    this.vcard.addJobTitle(this.statelessUser.job.getName());
    this.vcard.addEmail(this.statelessUser.identity.email);
    if(this.statelessUser.phoneNumbers) {
      this.statelessUser.phoneNumbers.forEach(
        phoneNumber => {
          this.vcard.addPhoneNumber(phoneNumber.value, phoneNumber.type);
        }
      );
    }
    console.log(this.vcard.toString());
  }

  public serializeAsBuffer(): Buffer {
    return Buffer.from(this.vcard.toString(), "utf8");
  }
}
