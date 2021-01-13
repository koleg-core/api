import { PhoneType } from "../enums/phone-type.enum";
import { Guard } from "core/guard";
import { Result } from "core/result";

export class PhoneNumber {

  constructor(
      public readonly type: PhoneType,
      public readonly value: string
  ) {}

  public static factory(type: PhoneType, value: string): Result<PhoneNumber> {
    const nonNullGuardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument:  type,
        argumentName: "type",
      },
      {
        argument:  value,
        argumentName: "value",
      }
    ]);
    if(!nonNullGuardResult.succeeded) {
      return Result.fail<PhoneNumber>(nonNullGuardResult.message);
    }
    if(!this._isPhoneNumberValid(value)) {
      return Result.fail<PhoneNumber>(`value ${value} is not in correct phoneNumber format.`);
    }

    return Result.ok<PhoneNumber>(new PhoneNumber(type, value));
  }

  public hasSameValue(phoneNumber: PhoneNumber): boolean {
    return this.value === phoneNumber.value;
  }

  private static _isPhoneNumberValid(value: string): boolean {
    const PHONE_NUMBER_REGEX = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/;
    return PHONE_NUMBER_REGEX.test(value);
  }
}
