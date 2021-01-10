import deepEqual from "deep-equal";

import { PhoneNumber } from "./PhoneNumber";
import { UserIdentity } from "./UserIdentity";
import { Job } from "./Job";

export class ReadableUser {
  constructor(
    private id: string,
    private identity: UserIdentity,
    private jobId: string,
    private groupsIds: string[],
    private profilePictureUrl: URL,
    private sshPublicKey: string,
    private phoneNumbers: PhoneNumber[],
    private expirationDate: Date,
    private birthdate: Date,
    private creationDate: Date = null,
    private disableDate: Date = null,
    private updateDate: Date = null
  ) {}

  public isDisabled():boolean {
    return this.disableDate <= new Date();
  }

  public getId(): string {
    return this.id;
  }

  public getUpdateDate(): Date {
    return this.updateDate;
  }

  public getIdentity(): UserIdentity {
    return this.identity;
  }

  public getJobId(): string {
    return this.jobId;
  }

  public getGroupIds(): string[] {
    return this.groupsIds;
  }

  public getProfilePictureUrl(): URL {
    return this.profilePictureUrl;
  }

  public isExpired(): boolean {
    return this.expirationDate && this.expirationDate < new Date();
  }

  public getSshPublicKey(): string {
    return this.sshPublicKey;
  }

  public getPhoneNumbers(): PhoneNumber[] {
    return this.phoneNumbers;
  }

  public getCreationDate(): Date {
    return this.creationDate;
  }

  public getExpirationDate(): Date {
    return this.expirationDate;
  }

  public getDisableDate(): Date {
    return this.disableDate;
  }

  public getBirthDate(): Date {
    return this.birthdate;
  }

  public equals(obj: unknown): boolean {
    return deepEqual(this, obj);
  }
}
