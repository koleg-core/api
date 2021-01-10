import { plainToClass } from "class-transformer";
import {
  ValidateNested,
  IsOptional,
  IsUUID,
  IsEmail,
  IsString,
  IsDate,
  IsUrl,
} from "class-validator";
import { Type } from "class-transformer";

import { SshKey } from "domain/user/SshKey";
import { UserIdentity } from "domain/user/UserIdentity";
import { Job } from "domain/user/Job";
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
  
  @IsDate()
  @IsOptional()
  public readonly birthdate: string;

  @IsEmail()
  @IsOptional()
  public readonly email: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => PasswordApiModel)
  public readonly password: PasswordApiModel = null;

  @ValidateNested({ each: true })
  @IsOptional()
  @IsUUID()
  public readonly groupIds: string[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => PhoneNumberApiModel)
  public readonly phoneNumbers: PhoneNumberApiModel[] = [];

  @IsString()
  @IsOptional()
  public readonly username: string;

  @IsUrl()
  @IsOptional()
  public readonly profilePictureUrl: URL;

  @IsUUID()
  @IsOptional()
  public readonly jobId: string = null;

  @IsOptional()
  @ValidateNested()
  @Type(() => SshKeyApiModel)
  public readonly sshKey: SshKeyApiModel = null;

  @IsDate()
  @IsOptional()
  public readonly expirationDate: string;
  
  @IsDate()
  @IsOptional()
  public readonly disableDate: string;

  constructor(
    firstName: string,
    lastName: string,
    birthdate: string,
    email: string,
    password: PasswordApiModel,
    groupIds: string[] = null,
    phoneNumbers: PhoneNumberApiModel[] = null, // TODO multiple phones numbers
    id: string = null,
    username: string = null,
    profilePictureUrl: URL = null,
    jobId: string = null,
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
    this.username = username;
    this.password = password;
    this.groupIds = groupIds;
    this.profilePictureUrl = plainToClass(URL, profilePictureUrl);
    this.expirationDate = expirationDate;
    this.disableDate = disableDate;
    this.jobId = jobId;

    if (Array.isArray(phoneNumbers) && phoneNumbers.length > 0) {
      phoneNumbers.forEach(phoneNumber => {
        this.phoneNumbers.push(plainToClass(PhoneNumberApiModel, phoneNumber));
      });
    }

    if (sshKey) {
      this.sshKey = plainToClass(SshKeyApiModel, sshKey);
    }
  }

  public static toWritableUserApiModel(user: StatelessUser): WritableUserApiModel {
    if (!user) {
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
      user.jobId,
      SshKeyApiModel.toSshKeyModel(sshKey),
      expirationDate,
      disableDate
    );
  }

  public toStatelessUser(id: string = null): StatelessUser {
    if (this.id && id && id !== this.id) {
      throw new Error("Invalid argument parameter id can't be different than this.id.");
    }

    // Implicity: this.id can be null
    const statelessId: string = id ? id : this.id;

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

    const sshKey: SshKey =
      this.sshKey && Object.keys(this.sshKey).length !== 0
        ? plainToClass(SshKeyApiModel, this.sshKey).toSshKey()
        : null;

    let phoneNumbers: PhoneNumber[] = [];
    if (Array.isArray(this.phoneNumbers)) {
      this.phoneNumbers.forEach(phoneNumberApi => phoneNumbers.push(
        plainToClass(PhoneNumberApiModel, phoneNumberApi)
          .toPhoneNumber())
      );
    } else {
      phoneNumbers = null;
    }

    let groupIds: string[] = [];
    if (Array.isArray(this.groupIds)) {
      groupIds = this.groupIds;
    } else {
      groupIds = null;
    }

    return new StatelessUser(
      statelessId,
      null,
      null,
      new UserIdentity(this.firstName, this.lastName, this.username, this.email),
      null,
      birthdate,
      null,
      phoneNumbers,
      groupIds,
      this.jobId,
      disableDate,
      this.profilePictureUrl,
      sshKey,
      expirationDate
    );
  }
}
