import { SerializerRoot } from "./serializer-root";
import { PhoneType } from "domain/enums/phone-type.enum";
import { PhoneTypeModel } from "../models/PhoneTypeModel";

export class PhoneTypeSerializer implements SerializerRoot<PhoneType, PhoneTypeModel> {

  public serialize(phoneType: PhoneType): PhoneTypeModel {
    return new PhoneTypeModel({name:phoneType});
  }
  public async deserialize(phoneTypeModel: PhoneTypeModel): Promise<PhoneType> {
    switch(phoneTypeModel.name) { 
    case "PHONE_HOME": { 
      return PhoneType.PHONE_HOME; 
    } 
    case "PHONE_WORK": { 
      return PhoneType.PHONE_WORK;   
    }
    case "PHONE_CELL_HOME": { 
      return PhoneType.PHONE_CELL_HOME;   
    }
    case "PHONE_CELL_WORK": { 
      return PhoneType.PHONE_CELL_WORK;   
    }  
              
            /*default: { 
               //statements; 
               break; 
            } */
    } 
  }
}