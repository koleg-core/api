import { v4 as uuid } from 'uuid';
import { Job } from './Job';

import { Password } from './Password';
import { PhoneNumber } from './PhoneNumber';
import { SshKey } from './SshKey';
import { UserIdentity } from './UserIdentity';
import { ReturnCodes } from './enums/return-codes.enum';
import { Group } from './Groups';
import { group } from 'console';

export class User {

  private _id: string;
  private _passwordHistory: Password[];
  private _creationDate: Date
  private _disableDate: Date;
  private _updateDate: Date;

  constructor(
    private _identity: UserIdentity,
    private _password: Password,
    private _job: Job,
    private _groups: Group[],
    private _profilePictureUrl: URL,
    private _sshKey: SshKey,
    private _birthdate: Date,
    private _phoneNumbers: PhoneNumber[],
    private _imgUrl: string = null,
    private _expirationDate: Date = null
  ) {
    this._id = uuid();
    this._passwordHistory.push(this._password);
    this._creationDate = this._updateDate = new Date();
  }

  public isDisabled():boolean {
    return this._disableDate <= new Date();
  }


  public disable(): number {
    let returnCode: ReturnCodes = ReturnCodes.NOTHING_CHANGED;
    // TODO: Edit expiration notion,
    // It's might be redondant with disabling notion
    // Can expiration be disableDate in the future ?
    if(!this._disableDate) {
      returnCode = ReturnCodes.UPDATED
      this._disableDate = new Date();
      this._update();
    }
    return returnCode;
  }

  public enable(): ReturnCodes {
    let returnCode: ReturnCodes = ReturnCodes.NOTHING_CHANGED;

    if(this._disableDate) {
      returnCode = ReturnCodes.UPDATED
      this._disableDate = null;
      this._update();
    }
    return returnCode;
  }

  public getUpdateDate(): Date {
    return this._updateDate;
  }

  public getIdentity(): UserIdentity {
    return this._identity;
  }

  public updateIdentity(identity: UserIdentity): ReturnCodes {
    if (!identity) {
      throw new Error('Invalid argument identity: UserIdentity');
    }

    if(!this._isEditable()) {
      return ReturnCodes.NOT_EDITABLE;
    }

    this._identity = identity;
    this._update();
    return ReturnCodes.UPDATED;
  }

  public updatePassword(password: Password): ReturnCodes {
    if (!password) {
      throw new Error('Invalid argument password: Password');
    }

    if(!this._isEditable()) {
      return ReturnCodes.NOT_EDITABLE;
    }

    if(this._wasPasswordAlreadyUsed(password)) {
      return ReturnCodes.WAS_ALREADY_USED;
    }

    this._password = password;
    this._passwordHistory.push(this._password);
    this._update();
    return ReturnCodes.UPDATED;
  }

  public getJob(): Job {
    return this._job;
  }

  public updateJob(job: Job): ReturnCodes {
    if (!job) {
      throw new Error('Invalid argument job: Job');
    }

    if(!this._isEditable()) {
      return ReturnCodes.NOT_EDITABLE;
    }

    this._job = job;
    this._update();
    return ReturnCodes.UPDATED;
  }

  public addGroup(newGroup: Group): ReturnCodes {
    if (!newGroup) {
      throw new Error('Invalid argument newGroup: Group');
    }

    if(!this._isEditable()) {
      return ReturnCodes.NOT_EDITABLE;
    }

    if(this._groups.includes(newGroup)) {
      return ReturnCodes.NOTHING_CHANGED;
    }

    this._groups.push(newGroup);
    return ReturnCodes.UPDATED;
  }

  public removeGroup(newGroup: Group): ReturnCodes {
    if (!newGroup) {
      throw new Error('Invalid argument newGroup: Group');
    }

    if(!this._isEditable()) {
      return ReturnCodes.NOT_EDITABLE;
    }

    if(this._groups.includes(newGroup)) {
      this._groups = this._groups
        .filter(inPlaceGroup => inPlaceGroup !== newGroup);
      return ReturnCodes.REMOVED;
    }

    return ReturnCodes.NOT_FOUND;
  }


  public getProfilePictureUrl(): URL {
    return this._profilePictureUrl;
  }

  public updateProfilePictureUrl(profilePictureUrl: URL): ReturnCodes {
    if(!profilePictureUrl) {
      throw new Error('Invalid argument profilePictureUrl: URL');
    }

    if(!this._isEditable()) {
      return ReturnCodes.NOT_EDITABLE;
    }

    this._profilePictureUrl = profilePictureUrl;
    this._update();
    return ReturnCodes.UPDATED;
  }

  public updateSshKey(sshKey: SshKey): ReturnCodes {
    if (!sshKey) {
      throw new Error('Invalid argument sshKay: SshKey');
    }

    if(!this._isEditable()) {
      return ReturnCodes.NOT_EDITABLE;
    }

    let returnCode: ReturnCodes = ReturnCodes.UPDATED;
    if(!this._sshKey) {
      returnCode = ReturnCodes.CREATED;
    }

    this._sshKey = sshKey;
    this._update();
    return returnCode;
  }

  public isExpired(): boolean {
    return this._expirationDate && this._expirationDate < new Date();
  }

  public canLogin(password: string, declinedIdentity: string): boolean {
    return !this.isDisabled()
      && this._identity.control(declinedIdentity)
      && this._password.isValueValid(password)
      && !this.isExpired();
  }

  public addPhoneNumber(phoneNumber: PhoneNumber): ReturnCodes {
    if (!phoneNumber) {
      throw new Error('Invalid argument phoneNumber: is null');
    }

    if(!this._isEditable()) {
      return ReturnCodes.NOT_EDITABLE;
    }

    let returnCode: ReturnCodes = ReturnCodes.CREATED;

    const phoneNumberIndex = this._findPhoneNumberIndexInList(phoneNumber);

    if (phoneNumberIndex >= 0) {
      returnCode = ReturnCodes.DUPLICATED;
    }

    this._phoneNumbers.push(phoneNumber);
    this._update();
    return returnCode;
  }

  public removePhoneNumber(phoneNumber: PhoneNumber): ReturnCodes {
    if (!phoneNumber) {
      throw new Error('Invalid argument phoneNumber: is null');
    }

    const phoneNumberIndex = this._findPhoneNumberIndexInList(phoneNumber);

    if (phoneNumberIndex >= 0) {
      this._phoneNumbers.splice(phoneNumberIndex, 1);
      this._update();
      return ReturnCodes.REMOVED;
    }

    return ReturnCodes.NOT_FOUND;
  }

  private _wasPasswordAlreadyUsed(password: Password): boolean {
    return this._passwordHistory.some(historicPassword => password.hasSameValue(historicPassword));
  }

  private _isEditable(): boolean {
    return !this.isExpired() && !this.isDisabled()
  }

  private _update(): void {
    this._updateDate = new Date();
  }

  private _findPhoneNumberIndexInList(phoneNumber: PhoneNumber): ReturnCodes {

    // Return -1 for not found
    return this._phoneNumbers
      .findIndex(registeredPhoneNumber => phoneNumber.hasSameValue(registeredPhoneNumber));
  }
}