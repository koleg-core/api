import { PhoneType } from "../enums/phone-type.enum"

export class PhoneNumber {

    private readonly PHONE_NUMBER_REGEX = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

    constructor(
        readonly type: PhoneType,
        readonly value: string
    ) {
        if (!type) {
            throw new Error('Invalid argument type: PhoneType');
        }

        if (this.value) {
            if (!this._isPhoneNumberValid(value)) {
                throw new Error("Invalid argument number: Don't respect constraint")
            }
        } else {
            throw new Error('Invalid argument value: string');
        }
    }

    public hasSameValue(phoneNumber: PhoneNumber): boolean {
        return this.value === phoneNumber.value;
    }

    private _isPhoneNumberValid(value: string): boolean {
        return this.PHONE_NUMBER_REGEX.test(value);
    }
}