import { OrganisationRepository } from "../../domain/repos/organisation.repository";
import { Database } from "../../infra/database/Database";
import { Organisation } from "../../domain/organisation";
import { Job } from "../../domain/user/Job";
import { JobSerializer } from "../../infra/database/serializer/job.serializer";
import { Sequelize } from "sequelize";
import { StatelessUser } from "../../domain/user/StatelessUser";

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
      remoteJobs.forEach(remoteJob => {
        organisation.addJob(JobSerializer.prototype.deserialize(remoteJob));
      })
    }

    // const remoteGroups = await this._database.getGroups();
    // if (Array.isArray(remoteGroups) && remoteGroups.length > 0) {
    //   remoteGroups.forEach(remoteGroup => {
    //     organisation.addGroup(GroupSerializer.deserialize(remoteGroup));
    //   })
    // }

    // const remoteUsers = await this._database.getJobs();
    // if (Array.isArray(remoteUsers) && remoteUsers.length > 0) {
    //   remoteUsers.forEach(remoteJob => {
    //     organisation.addUser(JobSerializer.deserializeUser(remoteJob));
    //   })
    // }

    return organisation;
  }

  createJob(job: Job): void {
    this._database.createJob(JobSerializer.prototype.serialize(job));
  }

  deleteJob(name: string): void {
    this._database.deleteJob(name);
  }

  createUser(userId: string, user: StatelessUser): void {
    // this._database.createUser(userId, user);
    throw new Error("Method not implemented.");
  }

  updateUser(userId: string, user: StatelessUser): void {
    // this._database.updateUser(userId, user);
    throw new Error("Method not implemented.");
  }

  deleteUser(userId: string): void {
    // this._database.deleteUser(userId);
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