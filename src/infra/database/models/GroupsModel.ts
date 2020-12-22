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

  interface GroupsModelAttributes{
    id: number;
    name: string;
    description: string;
    imgUrl: string;
    groups?: GroupsModel[] | GroupsModel['id'][];
    parentGroup?: GroupsModel | GroupsModel['id'];
  }

  interface GroupsModelCreationAttributes extends Optional<GroupsModelAttributes, "id"> {}

  export class GroupsModel extends Model<GroupsModelAttributes, GroupsModelCreationAttributes> implements GroupsModelAttributes{
    public id!: number;
    public name!:string;
    public description!: string;
    public imgUrl: string;
    getGroups: HasManyGetAssociationsMixin<GroupsModel>;
    getParentGroup: BelongsToGetAssociationMixin<GroupsModel>;
  }