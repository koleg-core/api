import { v4 as uuid } from 'uuid';
import { Job } from './Job';

import { Password } from './Password';
import { PhoneNumber } from './PhoneNumber';
import { SshKey } from './SshKey';
import { UserIdentity } from './UserIdentity';

class User {

  private _id: string;
  private _passwordHistory: Password[];
  private _creationDate: Date;
  private _removalDate: Date; // TODO
  private _updateDate: Date;

  constructor(
    private _identity: UserIdentity,
    private _password: Password,
    private _job: Job,
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

  public getUpdateDate(): Date {
    return this._updateDate;
  }

  public getIdentity(): UserIdentity {
    return this._identity;
  }

  public updateIdentity(identity: UserIdentity): void {
    if (identity) {
      this._identity = identity;
      this._update();
    } else {
      throw new Error('Invalid argument identity: UserIdentity');
    }
  }

  public updatePassword(password: Password): void {
    if (password && !this._isPasswordAlreadyUsed(password)) {
      this._password = password;
      this._passwordHistory.push(this._password);
      this._update();
    } else {
      throw new Error('Invalid argument password: Password');
    }
  }

  public getJob(): Job {
    return this._job;
  }

  public updateJob(job: Job): void {
    if (!job) {
      throw new Error('Invalid argument job: Job');
    }
    this._job = job;
    this._update();
  }

  public updateSshKey(sshKey: SshKey) {
    if (!sshKey) {
      throw new Error('Invalid argument sshKay: SshKey');
    }
    this._sshKey = sshKey;
    this._update();
  }

  public isExpired(): boolean {
    return this._expirationDate && this._expirationDate < new Date();
  }

  public canLogin(password: string, declinedIdentity: string): boolean {
    return this._identity.control(declinedIdentity) && this._password.isValueValid(password) && !this.isExpired();
  }

  public addPhoneNumber(phoneNumber: PhoneNumber): number {
    if (!phoneNumber) {
      throw new Error('Invalid argument phoneNumber: is null');
    }

    const phoneNumberIndex = this._findPhoneNumberIndexInList(phoneNumber);
    let returnCode = 1;

    if (phoneNumberIndex >= 0) {
      this._phoneNumbers[phoneNumberIndex] = phoneNumber;
      returnCode = 0;
    }

    this._phoneNumbers.push(phoneNumber);
    this._update();
    return returnCode;
  }

  public removePhoneNumber(phoneNumber: PhoneNumber): number {
    if (!phoneNumber) {
      throw new Error('Invalid argument phoneNumber: is null');
    }

    const phoneNumberIndex = this._findPhoneNumberIndexInList(phoneNumber);

    if (phoneNumberIndex >= 0) {
      this._phoneNumbers.splice(phoneNumberIndex, 1);
      this._update();
    }

    return phoneNumberIndex;
  }

  private _isPasswordAlreadyUsed(password: Password): boolean {
    return this._passwordHistory.some(historicPassword => password.hasSameValue(historicPassword));
  }

  private _update(): void {
    this._updateDate = new Date();
  }

  private _findPhoneNumberIndexInList(phoneNumber: PhoneNumber): number {
    return this._phoneNumbers
      .findIndex(registeredPhoneNumber => phoneNumber.hasSameValue(registeredPhoneNumber));
  }
}