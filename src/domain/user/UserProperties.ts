import { PhoneNumber } from './PhoneNumber';
import { UserIdentity } from './UserIdentity';
import { Job } from './Job';

export class UserProperties {
  constructor(
    private _id: string,
    private _identity: UserIdentity,
    private _job: Job,
    private _token: string,
    private _groupsIds: string[],
    private _profilePictureUrl: URL,
    private _sshPublicKey: string,
    private _phoneNumbers: PhoneNumber[],
    private _expirationDate: Date,
    private _birthdate: Date,
    private _creationDate: Date,
    private _disableDate: Date,
    private _updateDate: Date,
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

  public getToken(): string {
    return this._token;
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
}