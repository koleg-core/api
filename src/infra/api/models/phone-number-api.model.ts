import { PhoneNumber } from "domain/user/PhoneNumber";
import { PhoneType } from "domain/enums/phone-type.enum";

export class PhoneNumberApiModel {
  constructor(
        public readonly type: string,
        public readonly value: string
  ) { }

  public static toPhoneNumberApiModel(phone: PhoneNumber): PhoneNumberApiModel {
    return new PhoneNumberApiModel(phone.type, phone.value);
  }

  public toPhoneNumber(): PhoneNumber {
    return new PhoneNumber(
            this.type as PhoneType,
            this.value
    )
  }
}
