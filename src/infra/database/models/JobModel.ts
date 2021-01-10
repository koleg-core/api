import {
  Model,
  HasManyGetAssociationsMixin,
  Optional,
} from "sequelize";
import { UserModel } from "./UserModel";

interface JobAttributes {
  id: number;
  uuid: string;
  name: string;
  description: string;
  iconUrl: string;
  users?: UserModel[] | UserModel["id"][];
}

type JobCreationAttributes = Optional<JobAttributes, "id">

export class JobModel extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
  public id!: number;
  public uuid!: string;
  public name!: string;
  public description!: string;
  public iconUrl!: string;
  getUsers: HasManyGetAssociationsMixin<UserModel>;

  saveJob() {
    this.save();
  }
}