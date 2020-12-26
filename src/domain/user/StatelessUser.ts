import { PhoneNumber } from "./PhoneNumber";
import { UserIdentity } from "./UserIdentity";
import { Job } from "./Job";
import { Password } from "./Password";
import { SshKey } from "./SshKey";

export class StatelessUser {
  constructor(
    public readonly id: string,
    public readonly creationDate: Date,
    public readonly updateDate: Date,
    public readonly identity: UserIdentity,
    public readonly password: Password,
    public readonly birthdate: Date,
    public readonly passwordHistory?: Password[],
    public readonly phoneNumbers?: PhoneNumber[],
    public readonly groupsIds?: string[],
    public readonly job?: Job,
    public readonly disableDate?: Date,
    public readonly profilePictureUrl?: URL,
    public readonly sshKey?: SshKey,
    public readonly expirationDate?: Date
  ) {}
}
