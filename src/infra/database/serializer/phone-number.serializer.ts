import { SerializerRoot } from "./serializer-root";
import { PhoneNumber } from "domain/user/PhoneNumber";
import { UserPhone } from "../models/UserPhone";
import { PhoneTypeSerializer } from "./phone-type.serializer";

export class PhoneNumberSerializer implements SerializerRoot<PhoneNumber, UserPhone> {

  public async serialize(PhoneNumber: PhoneNumber): Promise<UserPhone> {
    return new UserPhone({ value: PhoneNumber.value });
  }

  public async deserialize(userPhone: UserPhone): Promise<PhoneNumber> {
    const phoneType = await PhoneTypeSerializer.prototype.deserialize(await userPhone.getType());
    return new PhoneNumber(phoneType,userPhone.value);
  }
}