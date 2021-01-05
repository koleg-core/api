import { OrganisationRepository } from "../../domain/repos/organisation.repository";
import { Database } from "../../infra/database/Database";
import { Organisation } from "../../domain/organisation";
import { Job } from "../../domain/user/Job";
import { JobSerializer } from "../../infra/database/serializer/job.serializer";
import { Sequelize } from "sequelize";
import { StatelessUser } from "../../domain/user/StatelessUser";
import { UserSerializer } from "infra/database/serializer/user.serializer";

export class OrganisationInSqlRepository implements OrganisationRepository {

  private _orm: Sequelize;
  private _database: Database;

  constructor(
    private uri: string
  ) {
    this._orm = new Sequelize(this.uri);
    this._database = new Database(this._orm);
  }

  save(organisation: Organisation): void {
    throw new Error("Method not implemented.");
  }

  read(): Organisation {
    throw new Error("Method not implemented.");
  }

  async readAsync(): Promise<Organisation> {
    const organisation = new Organisation();

    const remoteJobs = await this._database.getJobs();
    if (Array.isArray(remoteJobs) && remoteJobs.length > 0) {
      for await (let remoteJob of remoteJobs) {
        organisation.addJob(await JobSerializer.prototype.deserialize(remoteJob));
      }
    }

    // const remoteGroups = await this._database.getGroups();
    // if (Array.isArray(remoteGroups) && remoteGroups.length > 0) {
    //   remoteGroups.forEach(remoteGroup => {
    //     organisation.addGroup(GroupSerializer.deserialize(remoteGroup));
    //   })
    // }

    const remoteUsers = await this._database.getUsers();
    if (Array.isArray(remoteUsers) && remoteUsers.length > 0) {
      for await (let remoteUser of remoteUsers) {
        organisation.addUser(await UserSerializer.prototype.deserialize(remoteUser));
      }
    }

    return organisation;
  }

  async createJob(job: Job): Promise<void> {
    this._database.createJob(await JobSerializer.prototype.serialize(job));
  }

  deleteJob(name: string): void {
    this._database.deleteJob(name);
  }

  async createUser(user: StatelessUser): Promise<void> {
    const userModel = await UserSerializer.prototype.serialize(user);
    userModel.saveUser();
  }

  async updateUser(user: StatelessUser): Promise<void> {
    const userModel = await UserSerializer.prototype.serialize(user);
    console.log(userModel);
    userModel.saveUser();
  }

  deleteUser(userId: string): void {
    throw new Error("Method not implemented.");
  }

  createGroup(organisation: Organisation, groupId: string): void {
    throw new Error("Method not implemented.");
  }

  updateGroup(organisation: Organisation, groupId: string): void {
    throw new Error("Method not implemented.");
  }

  deleteGroup(organisation: Organisation, groupId: string): void {
    throw new Error("Method not implemented.");
  }

}
