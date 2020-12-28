import {
  IsDefined,
  IsPhoneNumber,
  IsString
} from "class-validator";

import { PhoneNumber } from "domain/user/PhoneNumber";
import { PhoneType } from "domain/enums/phone-type.enum";

export class PhoneNumberApiModel {
  @IsDefined()
  @IsString()
  public readonly type: string;
  @IsDefined()
  @IsPhoneNumber(null)
  public readonly value: string;
  constructor(
    type: string,
    value: string
  ) {
    // IMPORTANT:
    // The class validator fill object after creation,
    // then this constructor is here to external manipulations.
    // For the same reason, we can't throw error into constructor
    // for missing properties.

    this.value = value;
    this.type = type;
  }

  public static toPhoneNumberApiModel(phone: PhoneNumber): PhoneNumberApiModel {
    return new PhoneNumberApiModel(phone.type, phone.value);
  }

  public toPhoneNumber(): PhoneNumber {
    return new PhoneNumber(
            this.type as PhoneType,
            this.value
    );
  }
}
