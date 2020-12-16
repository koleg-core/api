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

interface JobCreationAttributes extends Optional<JobAttributes, "id"> {}

export class JobModel extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes{
  public id!: number;
  public name!:string;
}