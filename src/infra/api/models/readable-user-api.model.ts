import {
  ValidateNested,
  IsUUID,
  IsString,
  IsEmail,
  IsDate,
  IsUrl
} from "class-validator";

import { Job } from "domain/user/Job";
import { PhoneNumber } from "domain/user/PhoneNumber";
import { UserIdentity } from "domain/user/UserIdentity";
import { StatelessUser } from "domain/user/StatelessUser";
import { ReadableUser } from "domain/user/ReadableUser";
import {JobApiModel} from "./job-api.model";
import { PhoneNumberApiModel } from "./phone-number-api.model";

export class ReadableUserApiModel {

  @IsUUID()
  public readonly id: string;
  @IsString()
  public readonly firstName: string;
  @IsString()
  public readonly lastName: string;
  @IsString()
  public readonly username: string;
  @IsDate()
  public readonly birthdate: string;
  @IsEmail()
  public readonly email: string;
  public readonly groupIds: string[];
  @IsUrl()
  public readonly profilePictureUrl: string;
  @ValidateNested()
  public readonly job: JobApiModel;
  @ValidateNested({each: true})
  public readonly phones: PhoneNumberApiModel[]; // TODO multiple phones numbers
  @IsString()
  public readonly sshPublicKey: string;
  @IsDate()
  public readonly expirationDate: string;
  @IsDate()
  public readonly disableDate: string;
  @IsDate()
  public readonly updateDate: string;
  @IsDate()
  public readonly creationDate: string;
  constructor(
    id: string,
    firstName: string,
    lastName: string,
    username: string,
    birthdate: string,
    email: string,
    groupIds: string[],
    profilePictureUrl: string,
    job: JobApiModel,
    phones: PhoneNumberApiModel[], // TODO multiple phones numbers
    sshPublicKey: string,
    expirationDate: string,
    disableDate: string,
    updateDate: string,
    creationDate: string
  ) {
    // IMPORTANT:
    // The class validator fill object after creation,
    // then this constructor is here to external manipulations.
    // For the same reason, we can't throw error into constructor
    // for missing properties.

    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.birthdate = birthdate;
    this.email = email;
    this.groupIds = groupIds;
    this.profilePictureUrl = profilePictureUrl;
    this.job = job;
    this.phones = phones;
    this.sshPublicKey = sshPublicKey;
    this.expirationDate = expirationDate;
    this.disableDate = disableDate;
    this.updateDate = updateDate;
    this.creationDate = creationDate;
  }

  public static toReadableUserApiModel(user: ReadableUser): ReadableUserApiModel {

    const identity = user.getIdentity();
    const expirationDate: string =
      user.getExpirationDate()
        ? user.getExpirationDate().toISOString()
        : null;
    const disableDate: string =
      user.getDisableDate()
        ? user.getDisableDate().toISOString()
        : null;
    const job: JobApiModel =
      user.getJob() && Object.keys(user.getJob() ).length !== 0
        ? JobApiModel.toJobModel(user.getJob())
        : null;
    const phoneNumbersApiModel: PhoneNumberApiModel[] = [];
    user.getPhoneNumbers().forEach(
      phoneNumber => {
        phoneNumbersApiModel.push(
          PhoneNumberApiModel.toPhoneNumberApiModel(phoneNumber)
        );
      }
    );
    const profilePictureUrl: string =
      user.getProfilePictureUrl
        ? user.getProfilePictureUrl.toString()
        : null;
    const sshPublicKey: string =
      user.getSshPublicKey()
        ? user.getSshPublicKey()
        : null;

    return new ReadableUserApiModel(
      user.getId(),
      identity.firstName,
      identity.lastName,
      identity.username,
      user.getBirthDate().toISOString(),
      identity.email,
      user.getGroupIds(),
      profilePictureUrl,
      job,
      phoneNumbersApiModel,
      sshPublicKey,
      expirationDate,
      disableDate,
      user.getUpdateDate().toISOString(),
      user.getCreationDate().toISOString()
    );
  }

  public toStatelessUser(): StatelessUser {
    // If we don't check optional dates, we set date add 1970
    const expirationDate: Date =
      this.expirationDate
        ? new Date(this.expirationDate)
        : null;
    const disableDate: Date =
      this.disableDate
        ? new Date(this.disableDate)
        : null;
    const phoneNumbers: PhoneNumber[] = [];
    this.phones.forEach(
      phoneNumberApiModel => {
        phoneNumbers.push(
          phoneNumberApiModel.toPhoneNumber()
        );
      }
    );
    const job: Job =
    this.job && Object.keys(this.job).length !== 0
      ? this.job.toJob()
      : null;

    return new StatelessUser(
      this.id,
      new Date(this.creationDate),
      new Date(this.updateDate),
      new UserIdentity(this.firstName, this.lastName, this.username, this.email),
      null,
      new Date(this.birthdate),
      null,
      phoneNumbers,
      this.groupIds,
      job,
      disableDate,
      new URL(this.profilePictureUrl),
      null, // In convertion we lost information of private key
      expirationDate
    );
  }
}
