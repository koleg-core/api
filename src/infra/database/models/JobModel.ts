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
} from "sequelize";
import { UserModel } from "./UserModel";

interface JobAttributes{
  id: number;
  name: string;
  users?: UserModel[] | UserModel["id"][];
}

type JobCreationAttributes = Optional<JobAttributes, "id">

export class JobModel extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes{
  public id!: number;
  public name!:string;
  getUsers: HasManyGetAssociationsMixin<UserModel>;
}