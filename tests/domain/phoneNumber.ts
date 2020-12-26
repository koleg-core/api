import { PhoneNumber } from 'domain/user/PhoneNumber';
import { PhoneType } from 'domain/enums/phone-type.enum';

export const genPhoneNumber = (): PhoneNumber => {
  return new PhoneNumber(PhoneType.PHONE_CELL_HOME, "+33511931123");
}
