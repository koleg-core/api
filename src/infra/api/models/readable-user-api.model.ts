import { ValidateNested, IsDefined, IsEmail} from "class-validator";
import { Job } from "domain/user/Job";
import { UserIdentity } from "domain/user/UserIdentity";
import { PhoneNumber } from "domain/user/PhoneNumber";
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
    public readonly sshPublicKey: string, public readonly expirationDate: string,
    public readonly disableDate: string,
    public readonly updateDate: string,
    public readonly creationDate: string
  ) {
  }

  public static toReadableUserApiModel(user: ReadableUser): ReadableUserApiModel {

    const identity = user.getIdentity();
    const expirationDate: string =
      user.getExpirationDate()
        ? user.getExpirationDate().toISOString()
        : null;
    const disableDate: string =
      user.getDisableDate()
        ? user.getDisableDate().toISOString()
        : null;
    const job: Job =
      user.getJob() && Object.keys(user.getJob() ).length !== 0
        ? user.getJob()
        : null;
    const sshPublicKey: string =
      user.getSshPublicKey()
        ? user.getSshPublicKey()
        : null;

    return new ReadableUserApiModel(
      user.getId(),
      identity.firstName,
      identity.lastName,
      identity.username,
      user.getBirthDate().toISOString(),
      identity.email,
      user.getGroupIds(),
      user.getProfilePictureUrl().toString(),
      job,
      user.getPhoneNumbers(),
      sshPublicKey,
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
        ? new Date(this.expirationDate)
        : null;
    const disableDate: Date =
      this.disableDate
        ? new Date(this.disableDate)
        : null;
    const job: Job =
    this.job && Object.keys(this.job).length !== 0
      ? this.job
      : null;

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
      job,
      disableDate,
      new URL(this.profilePictureUrl),
      null, // In convertion we lost information of private key
      expirationDate
    );
  }
}
