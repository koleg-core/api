import { ValidateNested } from "class-validator";
import { SshKey } from "domain/user/SshKey";
import { UserIdentity } from "domain/user/UserIdentity";
import { Job } from "domain/user/Job";
import { Password } from "domain/user/Password";
import { PhoneNumber } from "domain/user/PhoneNumber";
import { StatelessUser } from "domain/user/StatelessUser";

export class WritableUserApiModel {
  @ValidateNested()
  public readonly password: Password;
  @ValidateNested({ each: true })
  public readonly phoneNumbers: PhoneNumber[];
  @ValidateNested()
  public readonly job: Job;
  @ValidateNested()
  public readonly sshKey: SshKey;

  constructor(
    public firstName: string,
    public lastName: string,
    public birthdate: string,
    public email: string,
    password: Password,
    public groupIds: string[],
    phoneNumbers: PhoneNumber[], // TODO multiple phones numbers
    public readonly username: string = null,
    public readonly profilePictureUrl: URL = null,
    job: Job = null,
    sshKey: SshKey = null,
    public readonly expirationDate: string = null,
    public readonly disableDate: string = null
  ) {
    this.password = password;
    this.phoneNumbers = phoneNumbers;
    this.job = job;
    if(sshKey && Object.keys(sshKey).length !== 0) {
      this.sshKey = sshKey;
    }
  }

  public static toWritableUserApiModel(user: StatelessUser): WritableUserApiModel {
    if(!user) {
      throw new Error("Invalid argument parameter user is null or undefined");
    }
    const expirationDate: string =
      user.expirationDate
        ? null
        : user.expirationDate.toISOString();
    const disableDate: string =
      user.disableDate
        ? null
        : user.disableDate.toISOString();
    const job: Job =
    Object.keys(user.job).length === 0
      ? null
      : user.job;
    const sshKey: SshKey =
    Object.keys(user.sshKey).length === 0
      ? null
      : user.sshKey;

    return new WritableUserApiModel(
      user.identity.firstName,
      user.identity.lastName,
      user.birthdate.toISOString(),
      user.identity.email,
      user.password,
      user.groupsIds,
      user.phoneNumbers,
      user.identity.username,
      user.profilePictureUrl,
      job,
      sshKey,
      expirationDate,
      disableDate
    );
  }

  public toStatelessUser(id: string = null): StatelessUser {
    const expirationDate: Date =
      this.expirationDate
        ? null
        : new Date(this.expirationDate);
    const disableDate: Date =
      this.disableDate
        ? null
        : new Date(this.disableDate);
    const job: Job =
      Object.keys(this.job).length === 0
        ? null
        : this.job;
    const sshKey: SshKey =
      Object.keys(this.sshKey).length === 0
        ? null
        : this.sshKey;

    return new StatelessUser(
      id,
      null,
      null,
      new UserIdentity(this.firstName, this.lastName, this.username, this.email),
      this.password,
      new Date(this.birthdate),
      null,
      this.phoneNumbers,
      this.groupIds,
      job,
      disableDate,
      this.profilePictureUrl,
      sshKey,
      expirationDate
    );
  }
}
