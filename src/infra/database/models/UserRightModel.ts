import { User } from "domain/user/User";
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
  Deferrable,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin
} from "sequelize";
import { GroupsModel } from "./GroupsModel";
import { PhoneTypeModel } from "./PhoneTypeModel";
import { RightModel } from "./RightModel";
import { UserModel } from "./UserModel";

export interface UserRightModelAttributes{
    id: number;
    idRight?: number;
    idUser?: number; 
    idImpactedGroup?: number;
    idImpactedUser?: number;
    right?: RightModel|RightModel['id'];
    user?: UserModel|UserModel['id'];
    impactedGroup?: GroupsModel|GroupsModel['id'];
    impactedUser?: UserModel|UserModel['id']; 
  }

type UserRightModelCreationAttributes = Optional<UserRightModelAttributes, "id">

export class UserRightModel extends Model<UserRightModelAttributes, UserRightModelCreationAttributes> implements UserRightModelAttributes{
    public id!: number;
    public idRight?: number;
    public idUser?: number;
    public idImpactedGroup?: number;
    public idImpactedUser?: number;
    public right?: RightModel|RightModel['id'];
    public user?: UserModel|UserModel['id'];
    public impactedGroup?: GroupsModel|GroupsModel['id'];
}
