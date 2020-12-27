import { ValidateNested, IsDefined, IsEmail} from "class-validator";
import { SshKey } from "domain/user/SshKey";
import { UserIdentity } from "domain/user/UserIdentity";
import { Job } from "domain/user/Job";
import { Password } from "domain/user/Password";
import { PhoneNumber } from "domain/user/PhoneNumber";
import { StatelessUser } from "domain/user/StatelessUser";

export class WritableUserApiModel {
  @IsDefined()
  public readonly firstName: string;
  @IsDefined()
  public readonly lastName: string;
  public readonly birthdate: string;
  @IsDefined()
  @IsEmail()
  public readonly email: string;
  @ValidateNested()
  public readonly password: Password;
  @IsDefined()
  public readonly groupIds: string[];
  @ValidateNested({ each: true })
  public readonly phoneNumbers: PhoneNumber[];
  @ValidateNested()
  public readonly job: Job;
  @ValidateNested()
  public readonly sshKey: SshKey;

  constructor(
    firstName: string,
    lastName: string,
    birthdate: string,
    email: string,
    password: Password,
    groupIds: string[] = [],
    phoneNumbers: PhoneNumber[] = [], // TODO multiple phones numbers
    public readonly username: string = null,
    public readonly profilePictureUrl: URL = null,
    job: Job = null,
    sshKey: SshKey = null,
    public readonly expirationDate: string = null,
    public readonly disableDate: string = null
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.email = email;
    this.password = password;
    this.groupIds = groupIds;
    this.phoneNumbers = phoneNumbers;
    this.job = job;
    this.sshKey = sshKey;
  }

  public static toWritableUserApiModel(user: StatelessUser): WritableUserApiModel {
    if(!user) {
      throw new Error("Invalid argument parameter user is null or undefined");
    }
    const birthdate: string =
      user.birthdate
        ? user.birthdate.toISOString()
        : null;
    const expirationDate: string =
      user.expirationDate
        ? user.expirationDate.toISOString()
        : null;
    const disableDate: string =
      user.disableDate
        ? user.disableDate.toISOString()
        : null;
    const job: Job =
      user.job && Object.keys(user.job).length !== 0
        ? user.job
        : null;
    const sshKey: SshKey =
    user.sshKey && Object.keys(user.sshKey).length !== 0
      ? user.sshKey
      : null;

    return new WritableUserApiModel(
      user.identity.firstName,
      user.identity.lastName,
      birthdate,
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
    const birthdate: Date =
      this.birthdate
        ? new Date(this.birthdate)
        : null;
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
    const sshKey: SshKey =
      this.sshKey && Object.keys(this.sshKey).length !== 0
        ? this.sshKey
        : null;

    return new StatelessUser(
      id,
      null,
      null,
      new UserIdentity(this.firstName, this.lastName, this.username, this.email),
      this.password,
      birthdate,
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
