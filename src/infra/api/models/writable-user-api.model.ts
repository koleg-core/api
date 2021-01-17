import { plainToClass } from "class-transformer";
import {
  ValidateNested,
  IsOptional,
  IsUUID,
  IsEmail,
  IsString,
  IsUrl,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";

import { SshKey } from "domain/user/SshKey";
import { UserIdentity } from "domain/user/UserIdentity";
import { PhoneNumber } from "domain/user/PhoneNumber";
import { StatelessUser } from "domain/user/StatelessUser";

import { PhoneNumberApiModel } from "./phone-number-api.model";
import { SshKeyApiModel } from "./ssh-key-api.model";
import { PasswordApiModel } from "./password-api.model";

class GroupId {
  @IsUUID()
  id: string;
}

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

  @IsDateString()
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
  @Type(() => GroupId)
  public readonly groupIds: string[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => PhoneNumberApiModel)
  public readonly phoneNumbers: PhoneNumberApiModel[] = [];

  @IsString()
  @IsOptional()
  public readonly username: string;

  @IsUUID()
  @IsOptional()
  public readonly jobId: string = null;

  @IsOptional()
  @ValidateNested()
  @Type(() => SshKeyApiModel)
  public readonly sshKey: SshKeyApiModel = null;

  @IsDateString()
  @IsOptional()
  public readonly expirationDate: string;

  @IsDateString()
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
        plainToClass(PhoneNumberApiModel, phoneNumberApi).toPhoneNumber())
      );
    }

    let groupIds: string[] = [];
    if (Array.isArray(this.groupIds)) {
      groupIds = this.groupIds;
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
      null,
      sshKey,
      expirationDate
    );
  }
}
