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

  interface UserAttributes{
    id: number;
    username: string;
    uuid: string;
  }

  interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

  export class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes{
    public id!: number;
    public username!:string;
    public uuid!:string;
  }