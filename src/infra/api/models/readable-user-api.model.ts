import { Job } from "domain/user/Job";
import { SshKey } from "domain/user/SshKey";
import { UserIdentity } from "domain/user/UserIdentity";
import { PhoneNumber } from "domain/user/PhoneNumber";
import { Password } from "domain/user/Password";
import { PhoneNumberApiModel } from "./phone-number-api.model"
import { JobApiModel } from "./job-api.model";
import { StatelessUser } from "domain/user/StatelessUser";
import { ReadableUser } from "domain/user/ReadableUser";

export class ReadableUserApiModel {

  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly username: string,
    public readonly birthdate: string,
    public readonly email: string,
    public readonly groupIds: string[],
    public readonly profilePictureUrl: string,
    public readonly job: Job,
    public readonly phones: PhoneNumber[], // TODO multiple phones numbers
    public readonly sshPublicKey: string,
    public readonly expirationDate: string,
    public readonly disableDate: string,
    public readonly updateDate: string,
    public readonly creationDate: string
  ) {
  }

  public static toReadableUserApiModel(user: ReadableUser): ReadableUserApiModel {

    const identity = user.getIdentity();

    const expirationDate: string =
      user.getExpirationDate()
      ? null
      : user.getExpirationDate().toISOString();
    const disableDate: string =
      user.getDisableDate()
      ? null
      : user.getDisableDate().toISOString();

    return new ReadableUserApiModel(
      user.getId(),
      identity.firstName,
      identity.lastName,
      identity.username,
      user.getBirthDate().toISOString(),
      identity.email,
      user.getGroupIds(),
      user.getProfilePictureUrl().toString(),
      user.getJob(),
      user.getPhoneNumbers(),
      user.getSshPublicKey() || null,
      expirationDate,
      disableDate,
      user.getUpdateDate().toISOString(),
      user.getCreationDate().toISOString()
    );
  }

  public toStatelessUser(): StatelessUser {
    // If we don't check optional dates, we set date add 1970
    const expirationDate: Date =
      this.expirationDate
      ? null
      : new Date(this.expirationDate);
    const disableDate: Date =
      this.disableDate
      ? null
      : new Date(this.disableDate);

    return new StatelessUser(
      this.id,
      new Date(this.creationDate),
      new Date(this.updateDate),
      new UserIdentity(this.firstName, this.lastName, this.username, this.email),
      null,
      new Date(this.birthdate),
      null,
      this.phones,
      this.groupIds,
      this.job,
      disableDate,
      new URL(this.profilePictureUrl),
      new SshKey(null, this.sshPublicKey),
      expirationDate
    );
  }
}
