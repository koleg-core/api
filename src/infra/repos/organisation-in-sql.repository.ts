import { OrganisationRepository } from "../../domain/repos/organisation.repository";
import { Database } from "../../infra/database/Database";
import { Organisation } from "../../domain/organisation";
import { Job } from "../../domain/user/Job";
import { JobSerializer } from "../../infra/database/serializer/job.serializer";
import { Sequelize } from "sequelize";
import { StatelessUser } from "../../domain/user/StatelessUser";
import { UserSerializer } from "infra/database/serializer/user.serializer";
import { GroupSerializer } from "infra/database/serializer/group.serializer";
import { Group } from "domain/group/Group";

export class OrganisationInSqlRepository implements OrganisationRepository {

  private _orm: Sequelize;
  private _database: Database;
  private _uriPrefix = "postgres://";

  constructor(
    private user?: string,
    private password?: string,
    private host?: string,
    private port?: number,
    private schema?: string,
    private uri?: string
  ) {
    const constructorParamError = "Invalid argument parameter: specify uri or all other param.";

    if(this.uri) {
      if(this.user || this.password || this.port || this.schema) {
        throw new Error(constructorParamError);
      }
    } else if(this.user && this.password && this.port && this.schema) {
      if(this.uri) {
        throw new Error(constructorParamError);
      }
      this.uri = this._uriPrefix + this.user
        + ":" + this.password + "@"
        + this.host + ":" + this.port
        + "/" + this.schema;
    } else {
      throw new Error(constructorParamError);
    }
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
      for await (const remoteJob of remoteJobs) {
        organisation.addJob(await JobSerializer.prototype.deserialize(remoteJob));
      }
    }

    const remoteGroups = await this._database.getGroups();
    if (Array.isArray(remoteGroups) && remoteGroups.length > 0) {
      for await (const remoteGroup of remoteGroups) {
        organisation.addGroupWithoutCheck(await GroupSerializer.prototype.deserialize(remoteGroup));
      }
    }

    const remoteUsers = await this._database.getUsers();
    if (Array.isArray(remoteUsers) && remoteUsers.length > 0) {
      for await (const remoteUser of remoteUsers) {
        organisation.addUser(await UserSerializer.prototype.deserialize(remoteUser));
      }
    }

    return organisation;
  }

  async createJob(job: Job): Promise<void> {
    (await JobSerializer.prototype.serialize(job)).saveJob();
  }

  async updateJob(job: Job): Promise<void> {
    (await JobSerializer.prototype.serialize(job)).saveJob();
  }

  deleteJob(name: string): void {
    this._database.deleteJob(name);
  }

  deleteGroup(groupId: string): void {
    this._database.deleteGroup(groupId);
  }

  async createUser(user: StatelessUser): Promise<void> {
    const userModel = await UserSerializer.prototype.serialize(user);
    userModel.saveUser();
  }

  async updateUser(user: StatelessUser): Promise<void> {
    const userModel = await UserSerializer.prototype.serialize(user);
    userModel.saveUser();
  }

  updateUserPassword(userId: string, password: string): void {
    this._database.updatePassword(userId, password);
  }

  deleteUser(userId: string): void {
    this._database.deleteUser(userId);
  }

  async createGroup(group: Group): Promise<void> {
    (await GroupSerializer.prototype.serialize(group)).saveGroup();
  }

  async updateGroup(group: Group): Promise<void> {
    (await GroupSerializer.prototype.serialize(group)).saveGroup();
  }

}
