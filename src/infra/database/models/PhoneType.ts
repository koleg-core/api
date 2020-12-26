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
  BelongsToManySetAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyCreateAssociationMixin
} from "sequelize";

  interface PhoneTypeAttributes{
    id: number;
    name: string;
  }

  type PhoneTypeCreationAttributes = Optional<PhoneTypeAttributes, "id">

export class PhoneType extends Model<PhoneTypeAttributes, PhoneTypeCreationAttributes> implements PhoneTypeAttributes{
    id!: number;
    name!: string;
}