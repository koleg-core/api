import {
  Model,
  HasManyGetAssociationsMixin,
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
import { UserPhone } from "./UserPhone";
import { UserPwdHistory } from "./UserPwdHistory";

interface UserAttributes {
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

export class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public uuid!: string;
  public firstname!: string;
  public lastname!: string;
  public password!: string;
  public passwordDateLimit!: Date;
  public birthdate!: Date;
  public email!: string;
  public imgUrl!: string;
  public sshPublicKey!: string;
  public sshPrivateKey!: string;
  public creationDate!: Date;
  public updateDate!: Date;
  public expirationDate!: Date;
  public disableDate!: Date;
  public job?: JobModel | JobModel['id'];
  public phones?: UserPhone[];
  public groups?: GroupsModel[];
  getJob: BelongsToGetAssociationMixin<JobModel>;
  setJob: BelongsToSetAssociationMixin<JobModel, JobModel["id"]>;
  getPhones: HasManyGetAssociationsMixin<UserPhone>;
  setPhones: HasManySetAssociationsMixin<UserPhone, UserPhone["value"]>;
  removePhone: HasManyRemoveAssociationMixin<UserPhone, UserPhone["value"]>;
  removePhones: HasManyRemoveAssociationsMixin<UserPhone, UserPhone["value"]>;
  getPasswords: HasManyGetAssociationsMixin<UserPwdHistory>;
  getGroups: BelongsToManyGetAssociationsMixin<GroupsModel>;
  addGroups: BelongsToManyAddAssociationsMixin<GroupsModel, GroupsModel['id']>;
  removeGroup: BelongsToManyRemoveAssociationMixin<GroupsModel, GroupsModel['id']>;
  removeGroups: BelongsToManyRemoveAssociationsMixin<GroupsModel, GroupsModel['id']>;

  async deletePhones() {
    const phones = await this.getPhones();
    if (Array.isArray(phones) && phones.length > 0) {
      await phones[0].destroy();
    }
  }

  async saveUser() {
    if (this.id) {
      await this.deletePhones();
      await this.removeGroups(await this.getGroups());
    }
    const user = await this.save();
    for await (const phone of this.phones) {
      phone.idUser = user.id;
      await phone.save()
    }
    await this.addGroups(this.groups);
    await this.setJob(this.job);

  }
}
