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

  interface PhoneTypeModelAttributes{
    id: number;
    name: string;
  }

  type PhoneTypeModelCreationAttributes = Optional<PhoneTypeModelAttributes, "id">

  export class PhoneTypeModel extends Model<PhoneTypeModelAttributes, PhoneTypeModelCreationAttributes> implements PhoneTypeModelAttributes{
    id!: number;
    name!: string;
}