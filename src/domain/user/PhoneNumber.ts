import { PhoneType } from "../enums/phone-type.enum";
import { Guard } from "core/guard";
import { Result } from "core/result";

export class PhoneNumber {

    private readonly PHONE_NUMBER_REGEX = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/;

    constructor(
      public readonly type: PhoneType,
      public readonly value: string
    ) {}

    public static factory(type: PhoneType, value: string): Result<PhoneNumber> {
      const typeGuardResult = Guard.againstNullOrUndefined(type, "type");
      if(!typeGuardResult.succeeded) {
        return Result.fail<PhoneNumber>(typeGuardResult.message);
      }
      const valueGuardResult = Guard.againstNullOrUndefined(value, "value");
      if(!valueGuardResult.succeeded) {
        return Result.fail<PhoneNumber>(valueGuardResult.message);
      }
      return Result.ok<PhoneNumber>(new PhoneNumber(type, value));
    }

    public hasSameValue(phoneNumber: PhoneNumber): boolean {
      return this.value === phoneNumber.value;
    }

    private isPhoneNumberValid(value: string): boolean {
      return this.PHONE_NUMBER_REGEX.test(value);
    }
}
