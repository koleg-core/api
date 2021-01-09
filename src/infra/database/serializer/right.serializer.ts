import { SerializerRoot } from "./serializer-root";
import { PhoneType } from "domain/enums/phone-type.enum";
import { PhoneTypeModel } from "../models/PhoneTypeModel";
import { RightModel } from "../models/RightModel";
import { Right } from "domain/user/Right";

export class RightSerializer implements SerializerRoot<Right, RightModel> {

  public async serialize(right: Right): Promise<RightModel> {
    //const rightExist = await RightModel.findOne({ where: { name: right } });
    return null;
  }
  public async deserialize(phoneTypeModel: RightModel): Promise<Right> {
    /*switch(phoneTypeModel.name) { 
    case 'PHONE_HOME': { 
      return PhoneType.PHONE_HOME; 
    } 
    case 'PHONE_WORK': { 
      return PhoneType.PHONE_WORK;   
    }
    case 'PHONE_CELL_HOME': { 
      return PhoneType.PHONE_CELL_HOME;   
    }
    case 'PHONE_CELL_WORK': { 
      return PhoneType.PHONE_CELL_WORK;   
    }  
              
            /*default: { 
               //statements; 
               break; 
            } */
    /*} */
    return null;
  }
}