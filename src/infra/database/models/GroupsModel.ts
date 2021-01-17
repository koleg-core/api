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
  BelongsToSetAssociationMixin,
  HasManySetAssociationsMixin
} from "sequelize";

  interface GroupsModelAttributes{
    id: number;
    uuid: string;
    name: string;
    description: string;
    imgUrl: string;
    groups?: GroupsModel[] | GroupsModel["id"][];
    parentGroup?: GroupsModel | GroupsModel["id"];
  }

  type GroupsModelCreationAttributes = Optional<GroupsModelAttributes, "id">

export class GroupsModel extends Model<GroupsModelAttributes, GroupsModelCreationAttributes> implements GroupsModelAttributes{
    public id!: number;
    public uuid!: string;
    public name!:string;
    public description!: string;
    public imgUrl: string;
    public parentGroup?: GroupsModel | GroupsModel['id'];
    public childrenGroups?: GroupsModel[] | GroupsModel['id'][];
    getGroups: HasManyGetAssociationsMixin<GroupsModel>;
    setGroups: HasManySetAssociationsMixin<GroupsModel,GroupsModel['id']>;
    getParentGroup: BelongsToGetAssociationMixin<GroupsModel>;
    setParentGroup: BelongsToSetAssociationMixin<GroupsModel,GroupsModel['id']>;

    async getGroupFromUuid(uuid: string) : Promise<GroupsModel>{
      return await GroupsModel.findOne({ where: { uuid } });
    }
    
    async saveGroup(){
      const record = await this.save();
      await record.setParentGroup(this.parentGroup);
      await record.setGroups(this.childrenGroups);
    }
    
}