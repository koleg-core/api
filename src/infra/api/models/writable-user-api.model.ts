import { SshKey } from "domain/user/SshKey";
import { UserIdentity } from "domain/user/UserIdentity";
import { Job } from "domain/user/Job";
import { Password } from "domain/user/Password";
import { PhoneNumber } from "domain/user/PhoneNumber";
import { StatelessUser } from "domain/user/StatelessUser";

export class WritableUserApiModel {
  constructor(
    public firstName: string,
    public lastName: string,
    public birthdate: string,
    public email: string,
    public password: Password,
    public groupIds: string[],
    public phoneNumbers: PhoneNumber[], // TODO multiple phones numbers
    public username: string = null,
    public profilePictureUrl: URL = null,
    public job: Job = null,
    public sshKey: SshKey = null,
    public expirationDate: string = null,
    public disableDate: string = null
  ) {}

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
      user.job,
      user.sshKey,
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
        this.job,
        disableDate,
        this.profilePictureUrl,
        this.sshKey,
        expirationDate
      );
    }
}
