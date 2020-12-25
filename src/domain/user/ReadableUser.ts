import deepEqual from 'deep-equal';

import { PhoneNumber } from './PhoneNumber';
import { UserIdentity } from './UserIdentity';
import { Job } from './Job';

export class ReadableUser {
  constructor(
    private _id: string,
    private _identity: UserIdentity,
    private _job: Job,
    private _groupsIds: string[],
    private _profilePictureUrl: URL,
    private _sshPublicKey: string,
    private _phoneNumbers: PhoneNumber[],
    private _expirationDate: Date,
    private _birthdate: Date,
    private _creationDate: Date = null,
    private _disableDate: Date = null,
    private _updateDate: Date = null
  ) {}

  public isDisabled():boolean {
    return this._disableDate <= new Date();
  }

  public getId(): string {
    return this._id;
  }

  public getUpdateDate(): Date {
    return this._updateDate;
  }

  public getIdentity(): UserIdentity {
    return this._identity;
  }

  public getJob(): Job {
    return this._job;
  }

  public getGroupIds(): string[] {
    return this._groupsIds;
  }

  public getProfilePictureUrl(): URL {
    return this._profilePictureUrl;
  }

  public isExpired(): boolean {
    return this._expirationDate && this._expirationDate < new Date();
  }

  public getSshPublicKey(): string {
    return this._sshPublicKey;
  }

  public getPhoneNumbers(): PhoneNumber[] {
    return this._phoneNumbers;
  }

  public getCreationDate(): Date {
    return this._creationDate;
  }

  public getExpirationDate(): Date {
    return this._expirationDate;
  }

  public getDisableDate(): Date {
    return this._disableDate;
  }

  public getBirthDate(): Date {
    return this._birthdate;
  }

  public equals(obj: unknown): boolean {
    return deepEqual(this, obj);
  }
}
