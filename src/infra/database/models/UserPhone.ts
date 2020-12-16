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
    Deferrable
  } from "sequelize";

  interface UserPhoneAttributes{
    idUser: number;
    idPhonetype: number;
    value: string;
  }

  export class UserPhone extends Model<UserPhoneAttributes> implements UserPhoneAttributes{
    public idUser!: number;
    public idPhonetype!:number;
    public value!:string;
  }