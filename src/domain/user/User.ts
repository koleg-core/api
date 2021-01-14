import { v4 as uuid } from "uuid";

import { Password } from "./Password";
import { PhoneNumber } from "./PhoneNumber";
import { SshKey } from "./SshKey";
import { UserIdentity } from "./UserIdentity";
import { ReturnCodes } from "../enums/return-codes.enum";
import { ReadableUser } from "./ReadableUser";
import { StatelessUser } from "./StatelessUser";
import {Guard} from "core/guard";
import {Result} from "core/result";

export class User {


  constructor(
    private _id: string,
    private _creationDate: Date,
    private _updateDate: Date,
    private _identity: UserIdentity,
    private _password: Password,
    private _birthdate: Date,
    private _passwordHistory: Password[],
    private _phoneNumbers: PhoneNumber[],
    private _groupsIds: string[] = [],
    private _jobId: string,
    private _disableDate: Date,
    private _profilePictureUrl: URL,
    private _sshKey: SshKey,
    private _expirationDate: Date,
  ){}
  // TODO: Add activation date, apply it into _isEditable

  factory(statelessUser: StatelessUser): Result<User> {
    const nonNullArgumentGuardResult = Guard.againstZeroSizeBulk([
      {
        argument: statelessUser,
        argumentName: "statelessUser",
      },
      {
        argument: statelessUser.identity,
        argumentName: "statelessUser.identity",
      },
      {
        argument: statelessUser.birthdate,
        argumentName: "statelessUser.birthdate",
      },
      {
        argument: statelessUser.creationDate,
        argumentName: "statelessUser",
      },
    ]);
    if(!nonNullArgumentGuardResult.succeeded) {
      return Result.fail<User>(nonNullArgumentGuardResult.message);
    }

    if (statelessUser.birthdate > new Date()) {
      return Result.fail<User>(`Negative age, statelessUser.birthdate: ${statelessUser.birthdate} is into the future.`);
    }

    const id = statelessUser.id || uuid();

    const phoneNumbers = Array.isArray(statelessUser.phoneNumbers) && statelessUser.phoneNumbers.length > 0
      ? statelessUser.phoneNumbers
      : [];

    const groupsIds = Array.isArray(statelessUser.groupsIds) && statelessUser.groupsIds.length > 0
      ? statelessUser.groupsIds
      : [];

    let passwordHistory: Password[];
    if (!statelessUser.passwordHistory) {
      passwordHistory = [];
    } else {
      if (statelessUser.passwordHistory.length === 0) {
        passwordHistory.push(statelessUser.password);
      } else if (!statelessUser.passwordHistory
        .some(password => {
          password.hasSameValue(statelessUser.password);
        }
        )) {
        return Result.fail<User>("Incoherent password history: `statelessUser.password` was not into `statelessUser.passwordHistory`.");
      }
    }

    const creationDate = new Date();
    const updateDate = creationDate;
    return Result.ok<User>(
      new User(id,
        creationDate,
        updateDate,
        statelessUser.identity,
        statelessUser.password,
        statelessUser.birthdate,
        passwordHistory,
        phoneNumbers || [],
        groupsIds || [],
        statelessUser.jobId || null,
        statelessUser.disableDate ||  null,
        statelessUser.profilePictureUrl || null,
        statelessUser.sshKey || null,
        statelessUser.expirationDate || null,
      ));
  }

  // Id =======
  public getId(): string {
    return this._id;
  }

  // Creation date =======
  public getCreationDate(): Date {
    return this._creationDate;
  }

  // Update date =======
  public getUpdateDate(): Date {
    return this._updateDate;
  }

  // Identity =======
  public getIdentity(): UserIdentity {
    return this._identity;
  }

  public updateIdentity(identity: UserIdentity): Result<string> {
    const identityGuardResult = Guard.againstNullOrUndefined(identity, "identity");
    if(!identityGuardResult.succeeded) {
      return Result.fail(identityGuardResult.message);
    }

    if (!this._isEditable()) {
      return this._getNotEditableResult();
    }

    this._identity = identity;
    this._update();
    return Result.ok(this._id);
  }

  // Password =======
  public updatePassword(password: Password): Result<string> {
    const passwordGuardResult = Guard.againstNullOrUndefined(password, "password");
    if (!passwordGuardResult.succeeded) {
      return Result.fail(passwordGuardResult.message);
    }

    if (!this._isEditable()) {
      return this._getNotEditableResult();
    }

    if (this._wasPasswordAlreadyUsed(password)) {
      // TODO: ~28 Replace comment by UseCaseError.
      return Result.fail("Password was already used.");
    }

    this._password = password;
    this._passwordHistory.push(this._password);
    this._update();
    return Result.ok("User Was updated");
  }

  public getPassword(): Password {
    return this._password;
  }

  // BirthDate =======
  public getBirthDate(): Date {
    return this._birthdate;
  }


  public updateBirthDate(birthdayDate: Date): Result<string> {
    const birthdayDateGuardResult = Guard.againstNullOrUndefined(birthdayDate, "birthdayDate");
    if (!birthdayDateGuardResult) {
      // TODO: ~28 Replace comment by UseCaseError.
      return Result.fail(birthdayDateGuardResult.message);
    }

    if (birthdayDate > new Date()) {
      // TODO: ~28 Replace comment by UseCaseError.
      return Result.fail("Invalid argument you birthdayDate is in future.");
    }

    if (!this._isEditable()) {
      // TODO: ~28 Replace comment by UseCaseError.
      return this._getNotEditableResult();
    }

    this._birthdate = birthdayDate;
    this._update();
    return Result.ok("BirthDate was updated");
  }

  // PhoneNumber =======
  public getPhoneNumbers(): PhoneNumber[] {
    return this._phoneNumbers;
  }

  public addPhoneNumber(phoneNumber: PhoneNumber): Result<string> {
    const phoneNumberGuardResult = Guard.againstNullOrUndefined(phoneNumber, "phoneNumber");
    if (!phoneNumberGuardResult.succeeded) {
      throw new Error(phoneNumberGuardResult.message);
    }

    if (!this._isEditable()) {
      return this._getNotEditableResult();
    }

    if (this._findPhoneNumberIndexInList(phoneNumber) >= 0) {
      // TODO: ~28 Replace comment by UseCaseError.
      return Result.fail("Phone number already exist into user.");
    }

    this._phoneNumbers.push(phoneNumber);
    this._update();
    return Result.ok("Phone number was updated");
  }

  public removePhoneNumber(phoneNumber: PhoneNumber): ReturnCodes {
    if (!phoneNumber) {
      throw new Error("Invalid argument phoneNumber: is null");
    }

    const phoneNumberIndex = this._findPhoneNumberIndexInList(phoneNumber);

    if (phoneNumberIndex >= 0) {
      this._phoneNumbers.splice(phoneNumberIndex, 1);
      this._update();
      return ReturnCodes.REMOVED;
    }

    return ReturnCodes.NOT_FOUND;
  }

  // Groups =======
  public addGroup(newGroupId: string): Result<string> {
    const newGroupIdGuardResult = Guard.againstNullOrUndefined(newGroupId, "newGroupId");
    if (!newGroupIdGuardResult.succeeded) {
      return Result.fail(newGroupIdGuardResult.message);
    }

    if (!this._isEditable()) {
      return this._getNotEditableResult();
    }

    if (this._groupsIds.includes(newGroupId)) {
      return Result.ok("Group is always into user.");
    }

    this._groupsIds.push(newGroupId);
    return Result.ok("User group updated.");
  }

  public getGroupIds(): string[] {
    return this._groupsIds;
  }

  public removeGroup(groupId: string): Result<string> {
    const groupIdGuardResult = Guard.againstNullOrUndefined(groupId, "groupId");
    if (!groupIdGuardResult.succeeded) {
      return Result.fail(groupIdGuardResult.message);
    }

    if (!this._isEditable()) {
      return this._getNotEditableResult();
    }

    const groupIndex: number = this._groupsIds.indexOf(groupId);
    if (groupIndex) {
      delete this._groupsIds[groupIndex];
      return Result.ok("Group was removed.");
    }

    return Result.fail("Not found.");
  }

  public updateGroups(groupsIds: string[]): Result<string> {
    const groupsIdsGuardResult = Guard.againstNullOrUndefined(groupsIds, "groupsIds");
    if(!groupsIdsGuardResult) {
      return Result.fail(groupsIdsGuardResult.message);
    }

    this._groupsIds = groupsIds;
    return Result.ok("Groups was updated.");
  }

  // Jobs =======
  public getJobId(): string {
    return this._jobId;
  }

  public updateJobId(jobId: string): Result<string> {
    const jobIdGuardResult = Guard.againstNullOrUndefined(jobId, "jobId");
    if(!jobIdGuardResult.succeeded) {
      return Result.fail(jobIdGuardResult.message);
    }
    const jobIdLengthGuardResult = Guard.againstZeroSize(jobId, "jobId");
    if(!jobIdLengthGuardResult.succeeded) {
      return Result.fail(jobIdLengthGuardResult.message);
    }

    if (!this._isEditable()) {
      return this._getNotEditableResult();
    }

    this._jobId = jobId;
    this._update();
    return Result.ok("User job is was updated.");
  }

  // Disable =======
  public isDisabled(): boolean {
    if (!this._disableDate) {
      return false;
    }
    return this._disableDate <= new Date();
  }

  public disable(): Result<string> {
    const returnCode: ReturnCodes = ReturnCodes.NOTHING_CHANGED;
    // TODO: Edit expiration notion,
    // It's might be redondant with disabling notion
    // Can expiration be disableDate in the future ?
    if (!this._disableDate) {
      this._disableDate = new Date();
      this._update();
      return Result.ok(`User: ${this._id} was disabled at: ${this._disableDate}`);
    }
    return Result.ok(`User: ${this._id} was already disabled at: ${this._disableDate}`);
  }

  public enable(): Result<string> {
    let returnCode: ReturnCodes = ReturnCodes.NOTHING_CHANGED;

    if (this._disableDate) {
      returnCode = ReturnCodes.UPDATED;
      this._disableDate = null;
      this._update();
      return Result.ok(`User: ${this._id} was re-enabled at: ${this._updateDate}`);
    }
    return Result.ok(`User: ${this._id} was already enable.`);
  }

  // ProfilePictureUrl =======
  public getProfilePictureUrl(): URL {
    return this._profilePictureUrl;
  }

  public updateProfilePictureUrl(profilePictureUrl: URL): Result<string> {
    const profilePictureUrlGuardResult = Guard.againstNullOrUndefined(
      profilePictureUrl,
      "profilePictureUrlGuardResult"
    );
    if(profilePictureUrlGuardResult) {
      return Result.fail(profilePictureUrlGuardResult.message);
    }

    if (!this._isEditable()) {
      return this._getNotEditableResult();
    }

    this._profilePictureUrl = profilePictureUrl;
    this._update();
    return Result.ok("Profile picture was updated.");
  }

  // SshKey =======
  public updateSshKey(sshKey: SshKey): Result<string> {
    const sshKeyGuardResult = Guard.againstNullOrUndefined(sshKey, "sshKey");
    if (!sshKeyGuardResult.message) {
      return Result.ok(sshKeyGuardResult.message);
    }

    if (!this._isEditable()) {
      return this._getNotEditableResult();
    }

    // TODO: maybe use ternary to define message
    // if (!this._sshKey) {
    // return Result.ok("Ssh key was added.");
    // }

    this._sshKey = sshKey;
    this._update();
    return Result.ok("Ssh key was updated.");
  }


  // Expiration =======
  public isExpired(): boolean {

    // TODO: we set !this._expirationDate cuz we don't want to return null
    //   !null => true
    return !(!this._expirationDate || this._expirationDate < new Date());
  }

  public getExpirationDate(): Date {
    return this._expirationDate;
  }

  public updateExpirationDate(expirationDate: Date): ReturnCodes {
    this._expirationDate = expirationDate;
    this._update();
    return ReturnCodes.UPDATED;
  }

  public canLogin(password: string, declinedIdentity: string): boolean {
    return !this.isDisabled()
      && this._identity.control(declinedIdentity)
      && this._password.isValueValid(password)
      && !this.isExpired();
  }

  // Exporting =======
  public getReadable(): ReadableUser {
    const publicKey: string = this._sshKey ? this._sshKey.publicKey : null;
    const disableDate: Date = this._disableDate ? this._disableDate : null;

    return new ReadableUser(
      this._id,
      this._identity,
      this._jobId,
      this._groupsIds,
      this._profilePictureUrl,
      publicKey,
      this._phoneNumbers,
      this._expirationDate,
      this._birthdate,
      this._creationDate,
      disableDate,
      this._updateDate);
  }

  public getStateLessUser(): StatelessUser {
    return new StatelessUser(
      this._id,
      this._creationDate,
      this._updateDate,
      this._identity,
      this._password,
      this._birthdate,
      this._passwordHistory,
      this._phoneNumbers,
      this._groupsIds,
      this._jobId,
      this._disableDate,
      this._profilePictureUrl,
      this._sshKey,
      this._expirationDate
    );
  }

  // Privates =======
  private _wasPasswordAlreadyUsed(password: Password): boolean {
    return this._passwordHistory.some(historicPassword => password.hasSameValue(historicPassword));
  }

  private _isEditable(): boolean {
    // TODO: ~28 Replace comment by UseCaseError.
    return !this.isExpired() && !this.isDisabled();
  }

  private _getNotEditableResult(): Result<string> {
    return Result.fail(`User: ${this._id} is not editable.`);
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
