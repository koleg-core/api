import { PhoneNumber } from '../../src/domain/user/PhoneNumber';
import { PhoneType } from '../../src/domain/enums/phone-type.enum';

export const genPhoneNumber = function(): PhoneNumber {
    return new PhoneNumber(PhoneType.PHONE_CELL_HOME, "+33511931123");
}