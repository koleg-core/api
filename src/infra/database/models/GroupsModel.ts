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
    uuid: string;
    name: string;
    description: string;
    imgUrl: string;
    groups?: GroupsModel[] | GroupsModel['id'][];
    parentGroup?: GroupsModel | GroupsModel['id'];
  }

  interface GroupsModelCreationAttributes extends Optional<GroupsModelAttributes, "id"> {}

  export class GroupsModel extends Model<GroupsModelAttributes, GroupsModelCreationAttributes> implements GroupsModelAttributes{
    public id!: number;
    public uuid!: string;
    public name!:string;
    public description!: string;
    public imgUrl: string;
    getGroups: HasManyGetAssociationsMixin<GroupsModel>;
    getParentGroup: BelongsToGetAssociationMixin<GroupsModel>;

    /*async getAllGroups(): Promise<GroupsModel[]>{
      let allGroups: GroupsModel[] = [];
      const parentGroup = await this.getParentGroup();
      allGroups.push(parentGroup);
      const groups = await this.getGroups();
      for(const group of groups){
        allGroups.push(group);
      }*/
    async getGroupFromUuid(uuid: string) : Promise<GroupsModel>{
      return await GroupsModel.findOne({ where: { uuid } });
    }


    
  }