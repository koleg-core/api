import { Organisation } from "../domain/Organisation";
import { OrganisationRepository } from "../domain/repos/organisation.repository";
import { Sequelize } from "sequelize";
import { Database } from "./database/Database";
import { GroupProperties } from "../domain/group/GroupProperties";
import { UserProperties } from "../domain/user/UserProperties";
import { Job } from "../domain/user/Job";
import { JobSerializer } from "./database/serializer/JobSerializer";
import { JobApiModel } from "./api/models/job-api.model";
import { User } from "../domain/user/User";

export class OrganisationInSql implements OrganisationRepository {

  private _orm;
  private _database;

  private _organisation: Organisation;

  constructor(
    private uri: string
  ) {
    this._orm = new Sequelize(this.uri);
    this._database = new Database(this._orm);
  }
  read(): Organisation {
    throw new Error("Method not implemented.");
  }

  async readAsync(): Promise<Organisation> {
    if (!this._organisation) {
      console.log("=== organisation does not exist ===");
      this._organisation = new Organisation('', '');

      const jobs: Job[] = (await this._database.getJobs())
        .map(remoteJob => JobSerializer.deserializeJob(remoteJob));
      // const users = await this._database.getUsers();
      // const groups = await this._database.getGroups();

      this._organisation.setJobs(jobs);

      return this._organisation;
    }
    console.log("=== organisation exist ===");
    return this._organisation;
  }

  createJob(organisation: Organisation) {

    // const jobToCreate = organisation.getJobs()
    //   .filter(job1 => !this._organisation.getJobs()
    //     .find(job2 => job1.getName() === job2.getName())
    //   )[0];
    console.log(organisation.getJobs());
    console.log(this._organisation.getJobs())
    const jobToCreate = organisation.getJobs()[organisation.getJobs().length - 1];
    console.log(jobToCreate);
    this._organisation.addJob(jobToCreate.getName());

    this._database.createJob(JobSerializer.serializeJob(jobToCreate));
  }





  save(organisation: Organisation): void {
    throw new Error("Method not implemented.");
  }

  // read(): Organisation {
  //   throw new Error("Method not implemented.");
  // }

  // saveUser(user: UserProperties): string {
  //   throw new Error("Method not implemented.");
  // }

  // readUser(userId: string): string {
  //   throw new Error("Method not implemented.");
  // }

  // saveGroup(group: GroupProperties): string {
  //   throw new Error("Method not implemented.");
  // }

  // readGroup(groupId: string): string {
  //   throw new Error("Method not implemented.");
  // }

  // async readJobs(): Promise<Job[]> {
  //   return this._database.getJobs()
  //     .then(jobsModel => {
  //       const jobs: Job[] = [];
  //       if (Array.isArray(jobsModel) && jobsModel.length > 0) {
  //         jobsModel.forEach(jobModel => jobs.push(JobSerializer.deserializeJob(jobModel)));
  //       }
  //       return jobs;
  //     });
  // }

}