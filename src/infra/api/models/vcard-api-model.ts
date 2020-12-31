import { VCard } from "vcard-creator";

import {StatelessUser} from "domain/user/StatelessUser";
import {VcardFormat} from "./vcard-format.enum";

// TODO:
// Add s3 serializer/and options in organisation service to regen vcards at each user update and store it on s3
// Move this into s3 model
// Create small api model that store vcard url
export class VcardApiModel {
  private vcards: VcardApiModel[] = [];

  constructor(
    private readonly statelessUsers: StatelessUser[] = [],
    private readonly organisationName: string,
    private format: VcardFormat,
  ) {
    // IMPORTANT:
    // The class validator fill object after creation,
    // then this constructor is here to external manipulations.
    // For the same reason, we can't throw error into constructor
    // for missing properties.

    statelessUsers.forEach(
      statelessUser => {
        const vcard = new VCard();
        vcard.addName(
          statelessUser.identity.lastName,
          statelessUser.identity.firstName
        );
        vcard.addCompagny(this.organisationName);
        vcard.addJobTitle(statelessUser.job.getName());
        vcard.addEmail(statelessUser.identity.email);
        vcard.addEmail(statelessUser.identity.email);
        if(statelessUser.phoneNumbers) {
          statelessUser.phoneNumbers.forEach(
            phoneNumber => {
              vcard.addPhoneNumber(phoneNumber.value, phoneNumber.type);
            }
          );
        }
        this.vcards.push(vcard);
      }
    );
  }
}
