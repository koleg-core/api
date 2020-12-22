import { Organisation } from "../domain/organisation";
import { OrganisationRepository } from "../domain/repos/organisation.repository";
import { Job } from "../domain/user/Job";
import { ReturnCodes } from "../domain/enums/return-codes.enum";
import { ReadableUser } from "../domain/user/ReadableUser";
import { StatelessUser } from "../domain/user/StatelessUser";

export class OrganisationService {

  private _organisation: Organisation;

  constructor(
    private repository: OrganisationRepository
  ) { }

  // JOBS

  public async getJobs(): Promise<Job[]> {
    await this._updateOrganisation()
    return this._organisation.getJobs();
  }

  public async getJob(name: string): Promise<Job> {
    await this._updateOrganisation();
    return this._organisation.getJob(name);
  }

  public async createJob(job: Job): Promise<ReturnCodes> {
    await this._updateOrganisation()
    const returnCode = this._organisation.addJob(job);
    if (returnCode === ReturnCodes.CREATED) {
      this.repository.createJob(job);
    }
    return returnCode;
  }

  public async deleteJob(name: string): Promise<ReturnCodes> {
    await this._updateOrganisation();
    const returnCode = this._organisation.deleteJob(name);
    if (returnCode === ReturnCodes.REMOVED) {
      this.repository.deleteJob(name);
    }
    return returnCode;
  }

  // USERS
  public async getUsers(): Promise<ReadableUser[]> {
    await this._updateOrganisation()
    return this._organisation.getUsersProperties();
  }

  public async getUserById(id: string): Promise<ReadableUser> {
    await this._updateOrganisation()
    return this._organisation.getReadableUserById(id);
  }

  public async updateUser(user: StatelessUser): Promise<ReturnCodes> {
    await this._updateOrganisation();
    const returnCode = this._organisation.updateUser(user);
    if (returnCode === ReturnCodes.UPDATED) {
      this.repository.updateUser(user.id, user);
    }
    return returnCode;
  }

  public async createUser(user: StatelessUser): Promise<string> {
    await this._updateOrganisation();
    const userId = this._organisation.addUser(user);
    if (userId) {
      this.repository.createUser(userId, user);
    }
    return userId;
  }

  public async deleteUser(id: string): Promise<ReturnCodes> {
    await this._updateOrganisation();
    const returnCode = this._organisation.deleteUser(id);
    if (returnCode === ReturnCodes.REMOVED) {
      this.repository.deleteUser(id);
    }
    return returnCode;
  }

  // GROUPS
  public getGroups() {
    throw new Error('Method not implemented.');
  }

  public getGroup() {
    throw new Error('Method not implemented.');
  }

  public createGroup() {
    throw new Error('Method not implemented.');
  }

  public updateGroup() {
    throw new Error('Method not implemented.');

  }

  public deleteGroup() {
    throw new Error('Method not implemented.');
  }

  private async _updateOrganisation() {
    if (!this._organisation) {
      this._organisation = await this.repository.readAsync();
    }
  }
}