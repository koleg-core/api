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
    BelongsToGetAssociationMixin
  } from "sequelize";
import { UserModel } from "./UserModel";

  interface RightsModelAttributes{
    id: number;
    name: string;
    description: string;
  }

  interface RightsModelCreationAttributes extends Optional<RightsModelAttributes, "id"> {}

  export class RightModel extends Model<RightsModelAttributes, RightsModelCreationAttributes> implements RightsModelAttributes{
    public id!: number;
    public name!:string;
    public description!: string;
  }