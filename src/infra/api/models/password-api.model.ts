import {
  IsOptional,
  IsString
} from "class-validator";

import { Password } from "domain/user/Password";

export class PasswordApiModel {

  @IsString()
  public readonly value: string;
  @IsOptional()
  @IsString()
  public readonly dateLimit: string;
  constructor(
    value: string,
    dateLimit: string = null
  ) {
    // IMPORTANT:
    // The class validator fill object after creation,
    // then this constructor is here to external manipulations.
    // For the same reason, we can't throw error into constructor
    // for missing properties.

    this.value = value;
    this.dateLimit = dateLimit;
  }

  public static toPasswordModel(password: Password): PasswordApiModel {
    return new PasswordApiModel(
      password.getValue(),
      password.getDateLimit().toISOString()
    );
  }

  public toPassword(): Password {
    return new Password(this.value, new Date(this.dateLimit));
  }
}
