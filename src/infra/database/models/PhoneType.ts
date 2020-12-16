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

  interface PhoneTypeAttributes{
    id: number;
    name: string;
  }

  interface PhoneTypeCreationAttributes extends Optional<PhoneTypeAttributes, "id"> {}

  export class PhoneType extends Model<PhoneTypeAttributes, PhoneTypeCreationAttributes> implements PhoneTypeAttributes{
    public id!: number;
    public name!: string;
  }