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
  BelongsToManyGetAssociationsMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  HasManySetAssociationsMixin,
  BelongsToManyAddAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin, 
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin
} from "sequelize";
import { GroupsModel } from "./GroupsModel";
import { JobModel } from "./JobModel";
import { PhoneTypeModel } from "./PhoneTypeModel";
import { UserPhone } from "./UserPhone";
import { UserPwdHistory } from "./UserPwdHistory";

  interface UserAttributes{
    id: number;
    username: string;
    uuid: string;
    firstname: string;
    lastname: string;
    password: string;
    passwordDateLimit: Date;
    birthdate: Date;
    email: string;
    imgUrl: string;
    sshPublicKey: string;
    sshPrivateKey: string;
    creationDate: Date;
    updateDate: Date;
    expirationDate: Date;
    disableDate: Date;
    job?: JobModel | JobModel["id"];
    phones?: UserPhone[] | UserPhone["value"][];
    passwords?: UserPwdHistory[] | UserPwdHistory["id"][];
    groups?: GroupsModel[] | GroupsModel["id"][];
  }

  type UserCreationAttributes = Optional<UserAttributes, "id">

export class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes{
    public id!: number;
    public username!:string;
    public uuid!:string;
    public firstname!: string;
    public lastname!: string;
    public password!: string;
    public passwordDateLimit!: Date;
    public birthdate!: Date;
    public email!: string;
    public imgUrl! : string;
    public sshPublicKey!: string;
    public sshPrivateKey!: string;
    public creationDate!: Date;
    public updateDate!: Date;
    public expirationDate!: Date;
    public disableDate!: Date;
    public job?: JobModel | JobModel["id"];
    public phones?: UserPhone[] | UserPhone["value"][];
    public groupsIds?: string[];
    getJob: BelongsToGetAssociationMixin<JobModel>;
    setJob: BelongsToSetAssociationMixin<JobModel, JobModel["id"]>;
    getPhones: HasManyGetAssociationsMixin<UserPhone>;
    setPhones: HasManySetAssociationsMixin<UserPhone,UserPhone["value"]>;
    removePhone: HasManyRemoveAssociationMixin<UserPhone,UserPhone["value"]>;
    removePhones: HasManyRemoveAssociationsMixin<UserPhone,UserPhone["value"]>;
    getPasswords: HasManyGetAssociationsMixin<UserPwdHistory>;
    getGroups: BelongsToManyGetAssociationsMixin<GroupsModel>;
    addGroup: BelongsToManyAddAssociationsMixin<GroupsModel, GroupsModel["id"]>;
    removeGroup: BelongsToManyRemoveAssociationMixin<GroupsModel, GroupsModel["id"]>;
    removeGroups: BelongsToManyRemoveAssociationsMixin<GroupsModel, GroupsModel["id"]>;
    async deletePhones() {
      const phones = await this.getPhones();
      await phones[0].destroy();
    }

    async saveUser(){
      const userExist = await UserModel.findOne({where: {uuid: this.uuid}});
      if(userExist){
        console.log("user existant");
        this.id = userExist.id;
        this.isNewRecord = false;
        //await this.deletePhones();
        /*const groups = await this.getGroups();
        for(const group of groups){
          await this.removeGroup(group);
        }*/
        //await this.removeGroups(await this.getGroups());
        
        for(const phone of this.phones){
          console.log(phone);
        }
        await this.save();
      }
      else{
        console.log("user inexistant");
        console.log(userExist);
        
      }
    }
}
