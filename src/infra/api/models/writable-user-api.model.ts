import { plainToClass } from "class-transformer";
import {
  ValidateNested,
  IsOptional,
  IsUUID,
  IsEmail,
  IsString,
  IsUrl
} from "class-validator";

import { SshKey } from "domain/user/SshKey";
import { UserIdentity } from "domain/user/UserIdentity";
import { Job } from "domain/user/Job";
import { Password } from "domain/user/Password";
import { PhoneNumber } from "domain/user/PhoneNumber";
import { StatelessUser } from "domain/user/StatelessUser";

import { PhoneNumberApiModel } from "./phone-number-api.model";
import { JobApiModel } from "./job-api.model";
import { SshKeyApiModel } from "./ssh-key-api.model";
import { PasswordApiModel } from "./password-api.model";

export class WritableUserApiModel {
  @IsUUID()
  @IsOptional()
  public readonly id: string;
  @IsString()
  @IsOptional()
  public readonly firstName: string;
  @IsString()
  @IsOptional()
  public readonly lastName: string;
  @IsString()
  @IsOptional()
  public readonly birthdate: string;
  @IsEmail()
  @IsOptional()
  public readonly email: string;
  @ValidateNested()
  @IsOptional()
  public readonly password: PasswordApiModel = null;
  @ValidateNested({ each: true })
  @IsOptional()
  public readonly groupIds: string[];
  @ValidateNested({ each: true })
  @IsOptional()
  public readonly phoneNumbers: PhoneNumberApiModel[] = [];
  @IsString()
  @IsOptional()
  public readonly username: string;
  @IsUrl()
  @IsOptional()
  public readonly profilePictureUrl: URL;
  @ValidateNested()
  @IsOptional()
  public readonly job: JobApiModel = null;
  @IsOptional()
  @ValidateNested()
  public readonly sshKey: SshKeyApiModel = null;
  @IsString()
  @IsOptional()
  public readonly expirationDate: string;
  @IsString()
  @IsOptional()
  public readonly disableDate: string;

  constructor(
    firstName: string,
    lastName: string,
    birthdate: string,
    email: string,
    password: PasswordApiModel,
    groupIds: string[] = [],
    phoneNumbers: PhoneNumberApiModel[] = [], // TODO multiple phones numbers
    id: string = null,
    username: string = null,
    profilePictureUrl: URL = null,
    job: JobApiModel = null,
    sshKey: SshKeyApiModel = null,
    expirationDate: string = null,
    disableDate: string = null
  ) {
    // IMPORTANT:
    // The class validator fill object after creation,
    // then this constructor is here to external manipulations.
    // For the same reason, we can't throw error into constructor
    // for missing properties.
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.email = email;
    this.password = password;
    this.groupIds = groupIds;
    if(phoneNumbers.length > 0) {
      phoneNumbers.forEach(phonNumber => {
        this.phoneNumbers.push(plainToClass(PhoneNumberApiModel, phonNumber));
      });
    }
    this.phoneNumbers = phoneNumbers;
    this.username = username;
    this.profilePictureUrl = plainToClass(URL, profilePictureUrl);
    if(job) {
      this.job = plainToClass(JobApiModel, job);
    }
    if(sshKey) {
      this.sshKey = plainToClass(SshKeyApiModel, sshKey);
    }
    this.expirationDate = expirationDate;
    this.disableDate = disableDate;
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

    const phoneNumberApiModel: PhoneNumberApiModel[] = [];
    user.phoneNumbers.forEach(
      phoneNumber => phoneNumberApiModel.push(
        PhoneNumberApiModel.toPhoneNumberApiModel(phoneNumber)
      )
    );

    return new WritableUserApiModel(
      user.identity.firstName,
      user.identity.lastName,
      birthdate,
      user.identity.email,
      PasswordApiModel.toPasswordModel(user.password),
      user.groupsIds,
      phoneNumberApiModel,
      user.identity.username,
      user.id,
      user.profilePictureUrl,
      JobApiModel.toJobModel(job),
      SshKeyApiModel.toSshKeyModel(sshKey),
      expirationDate,
      disableDate
    );
  }

  public toStatelessUser(id: string = null): StatelessUser {
    if(this.id && id && id !== this.id) {
      throw new Error("Invalid argument parameter id can't be different than this.id.");
    }

    // Implicity: this.id can be null
    const statelessId: string = id ? id : this.id;

    // IMPORTANT: in fault of class validation, we can type object properties
    // as PasswordApiModel, PhoneNumberApiModel into constructor.
    // Then we type it into exporter.
    const password: Password =
      this.password
        ? plainToClass(PasswordApiModel, this.password).toPassword()
        : null;
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
        ? plainToClass(JobApiModel, this.job).toJob()
        : null;
    const sshKey: SshKey =
      this.sshKey && Object.keys(this.sshKey).length !== 0
        ? plainToClass(SshKeyApiModel, this.sshKey).toSshKey()
        : null;
    const phoneNumber: PhoneNumber[] = [];
    this.phoneNumbers.forEach(
      phoneNumberApi => phoneNumber.push(
        plainToClass(PhoneNumberApiModel, phoneNumberApi)
          .toPhoneNumber())
    );

    return new StatelessUser(
      statelessId,
      null,
      null,
      new UserIdentity(this.firstName, this.lastName, this.username, this.email),
      password,
      birthdate,
      null,
      phoneNumber,
      this.groupIds,
      job,
      disableDate,
      this.profilePictureUrl,
      sshKey,
      expirationDate
    );
  }
}
