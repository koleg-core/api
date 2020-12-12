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

interface JobAttributes{
  id: number;
  name: string;
}

type JobCreationAttributes = Optional<JobAttributes, "id">

export class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes{
  public id!: number;
  public name!:string;
}