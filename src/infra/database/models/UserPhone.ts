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
  BelongsToSetAssociationMixin
} from "sequelize";
import { PhoneType } from "./PhoneType";
import { UserModel } from "./UserModel";

export interface UserPhoneAttributes{
    value: string;
    /*idUser: number;
    idPhoneType: number;*/
    user?: UserModel|UserModel['id'];
    type?: PhoneType|PhoneType['id'];
  }

export class UserPhone extends Model<UserPhoneAttributes> implements UserPhoneAttributes{
    public value!:string;
    /*public idUser!:number;
    public idPhoneType!:number;*/
    setUser: BelongsToSetAssociationMixin<UserModel, UserModel['id']>;
    setType?: BelongsToSetAssociationMixin<PhoneType, PhoneType['id']>;
  }
