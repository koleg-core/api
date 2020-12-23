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
    BelongsToManyAddAssociationsMixin
  } from "sequelize";
import { GroupsModel } from "./GroupsModel";
import { JobModel } from "./JobModel";
import { PhoneType } from "./PhoneType";
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
    sshKey: Blob;
    creationDate: Date;
    updateDate: Date;
    expirationDate: Date;

    job?: JobModel | JobModel['id'];
    phones?: UserPhone[] | UserPhone['value'][];
    passwords?: UserPwdHistory[] | UserPwdHistory['id'][];
    groups?: GroupsModel[] | GroupsModel['id'][];
  }

  interface UserCreationAttributes extends Optional<UserAttributes, "id"> {

  }

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
    public sshKey!: Blob;
    public creationDate!: Date;
    public updateDate!: Date;
    public expirationDate!: Date;

    getJob: BelongsToGetAssociationMixin<JobModel>;
    setJob: BelongsToSetAssociationMixin<JobModel, JobModel['id']>;
    getPhones: BelongsToManyGetAssociationsMixin<PhoneType>;
    setPhones: HasManySetAssociationsMixin<UserPhone,UserPhone['value']>;
    getPasswords: HasManyGetAssociationsMixin<UserPwdHistory>;
    getGroups: BelongsToManyGetAssociationsMixin<GroupsModel>;
    addGroup: BelongsToManyAddAssociationsMixin<GroupsModel, GroupsModel['id']>;

    getPasswordsTest(): Promise<any>{
      return this.getPhones()
      .then((response:any)=>{
        for (const result of response) {
          /*for (const tag of result.tags) {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          }*/
          console.log(result.dataValues.value);
      }
      })
    }
  }
