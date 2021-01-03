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
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin
} from "sequelize";

  interface RightModelAttributes{
    id: number;
    name: string;
    description: string;
  }

  type RightModelCreationAttributes = Optional<RightModelAttributes, "id">

export class RightModel extends Model<RightModelAttributes, RightModelCreationAttributes> implements RightModelAttributes{
    public id!: number;
    public name!:string;
    public description!: string;
}