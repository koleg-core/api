import { Job } from "../../../domain/user/Job";
import { SshKey } from "../../../domain/user/SshKey";
import { UserIdentity } from "../../../domain/user/UserIdentity";
import { PhoneNumber } from "../../../domain/user/PhoneNumber";
import { Password } from "../../../domain/user/Password";
import { PhoneNumberApiModel } from "./phone-number-api.model"
import { JobApiModel } from "./job-api.model";
import { StatelessUser } from "../../../domain/user/StatelessUser";

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
    public readonly job: JobApiModel,
    public readonly phones: PhoneNumberApiModel[], // TODO multiple phones numbers
    public readonly sshPublicKey: string,
    public readonly expirationDate: string,
    public readonly disableDate: string,
    public readonly updateDate: string,
    public readonly creationDate: string
  ) {
  }

  public static toReadableUserApiModel(user: StatelessUser): ReadableUserApiModel {

    const phones: PhoneNumberApiModel[] = [];
    if (Array.isArray(user.phoneNumbers) && user.phoneNumbers.length > 0) {
      user.phoneNumbers.forEach(phone => phones.push(PhoneNumberApiModel.toPhoneNumberApiModel(phone)));
    }

    return new ReadableUserApiModel(
      user.id,
      user.identity.firstName,
      user.identity.lastName,
      user.identity.username,
      user.birthdate.toISOString(),
      user.identity.email,
      user.groupsIds,
      user.profilePictureUrl.toString(),
      JobApiModel.toJobModel(user.job),
      phones,
      user.sshKey.publicKey,
      user.expirationDate.toISOString(),
      user.disableDate.toISOString(),
      user.updateDate.toISOString(),
      user.creationDate.toISOString()
    );
  }

  public toStatelessUser(): StatelessUser {
    const phones: PhoneNumber[] = [];
    if (Array.isArray(this.phones) && this.phones.length > 0) {
      this.phones.forEach(phone => phones.push(phone.toPhoneNumber()))
    }

    return new StatelessUser(
      this.id,
      new Date(this.creationDate),
      new Date(this.updateDate),
      new UserIdentity(this.firstName, this.lastName, this.username, this.email),
      null,
      new Date(this.birthdate),
      null,
      phones,
      this.groupIds,
      this.job.toJob(),
      new Date(this.disableDate),
      new URL(this.profilePictureUrl),
      new SshKey(null, this.sshPublicKey),
      new Date(this.expirationDate)
    );
  }
}