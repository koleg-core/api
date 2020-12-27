import {
  Sequelize,
  Model,
  ModelDefined,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  Association,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Optional,
  Deferrable,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin
} from "sequelize";
import { PhoneTypeModel } from "./PhoneTypeModel";
import { UserModel } from "./UserModel";

export interface UserPhoneAttributes{
    value: string;
    idUser?: number;
    idPhoneType?: number; 
    user?: UserModel|UserModel["id"];
    type?: PhoneTypeModel|PhoneTypeModel["id"];
  }

export class UserPhone extends Model<UserPhoneAttributes> implements UserPhoneAttributes{
    public value!:string;
    public idUser!:number;
    public idPhoneType!:number;
    public user?: UserModel|UserModel["id"];
    public type?: PhoneTypeModel|PhoneTypeModel["id"];
    setUser: BelongsToSetAssociationMixin<UserModel, UserModel["id"]>;
    setType?: BelongsToSetAssociationMixin<PhoneTypeModel, PhoneTypeModel["id"]>;
    getType?: BelongsToGetAssociationMixin<PhoneTypeModel>;
    //createType: BelongsToCreateAssociationMixin<PhoneTypeModel>;
}
