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
  BelongsToManyGetAssociationsMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  HasManySetAssociationsMixin
} from "sequelize";
import { JobModel } from "./JobModel";
import { UserPhone } from "./UserPhone";

  interface UserAttributes{
    id: number;
    username: string;
    uuid: string;
    job?: JobModel | JobModel["id"];
    phones?: UserPhone[] | UserPhone["value"][];
  }

  type UserCreationAttributes = Optional<UserAttributes, "id">

export class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes{
    public id!: number;
    public username!:string;
    public uuid!:string;
    getJob: BelongsToGetAssociationMixin<JobModel>;
    setJob: BelongsToSetAssociationMixin<JobModel, JobModel["id"]>;
    getPhones: HasManyGetAssociationsMixin<UserPhone>;
    setPhones: HasManySetAssociationsMixin<UserPhone,UserPhone["value"]>;
}