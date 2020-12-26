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
  BelongsToManyGetAssociationsMixin
} from "sequelize";

  interface UserPwdHistoryAttributes{
    id: number;
    updateDate: Date;
    idUser: number;
    password: string;
  }

  type UserPwdHistoryCreationAttributes = Optional<UserPwdHistoryAttributes, "id">

export class UserPwdHistory extends Model<UserPwdHistoryAttributes, UserPwdHistoryCreationAttributes> implements UserPwdHistoryAttributes{
    public id!: number;
    public updateDate!:Date;
    public idUser!:number;
    public password!:string;
}