import { Organisation } from "domain/organisation";
import { OrganisationRepository } from "../domain/repos/organisation.repository";
import { Job } from "../domain/user/Job";
import { ReturnCodes } from "../domain/enums/return-codes.enum";
import { ReadableUser } from "../domain/user/ReadableUser";
import { StatelessUser } from "../domain/user/StatelessUser";
import { Group } from "domain/group/Group";

export class OrganisationService {

  private _organisation: Organisation;

  constructor(
    private repository: OrganisationRepository
  ) { }

  // ORGANISATION
  public async getName(): Promise<string> {
    await this._updateOrganisation();
    return this._organisation.getId();
  }

  // JOBS
  public async getJobs(): Promise<Job[]> {
    await this._updateOrganisation();
    return this._organisation.getJobs();
  }

  public async getJob(id: string): Promise<Job> {
    await this._updateOrganisation();
    return this._organisation.getJob(id);
  }

  public async createJob(job: Job): Promise<string> {
    await this._updateOrganisation();
    const jobId = this._organisation.addJob(job);
    if (jobId) {
      this.repository.createJob(job);
    }
    return jobId;
  }

  public async updateJob(job: Job): Promise<ReturnCodes> {
    await this._updateOrganisation();
    const returnCode = this._organisation.updateJob(job);
    if (returnCode === ReturnCodes.UPDATED) {
      this.repository.updateJob(job);
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

  public async getUsersNumberByJob(id: string): Promise<string> {
    await this._updateOrganisation();
    return this._organisation.getUsersNumberByJob(id)
  }

  // USERS
  public async getUsers(): Promise<ReadableUser[]> {
    await this._updateOrganisation();
    return this._organisation.getReadableUsers();
  }

  public async getUserById(id: string): Promise<ReadableUser> {
    await this._updateOrganisation();
    return this._organisation.getReadableUserById(id);
  }

  public async getUserByIdWithPassword(id: string): Promise<StatelessUser> {
    await this._updateOrganisation();
    return this._organisation.getStatelessUserById(id);
  }

  public async updateUser(user: StatelessUser): Promise<ReturnCodes> {

    if (!user) {
      throw Error("Invalid user argument user: StatelessUser.");
    }

    await this._updateOrganisation();

    const returnCode = this._organisation.updateUser(user);
    if (returnCode === ReturnCodes.UPDATED) {
      const userToSave: StatelessUser = this._organisation.getStatelessUserById(user.id);
      this.repository.createUser(userToSave);
    }
    return returnCode;
  }

  public async updateUserPassword(userId: string, newPassword: string): Promise<ReturnCodes> {
    await this._updateOrganisation();

    const returnCode = this._organisation.updateUserPassword(userId, newPassword);
    if (returnCode === ReturnCodes.UPDATED) {
      this.repository.updateUserPassword(userId, newPassword);
      return returnCode;
    }
  }

  public async updateUserProfilePictureUrl(userId: string, profilePictureUrl: URL) {
    await this._updateOrganisation();

    const returnCode = this._organisation.updateUserProfilePictureUrl(userId, profilePictureUrl);
    if (returnCode === ReturnCodes.UPDATED) {
      const userToSave: StatelessUser = this._organisation.getStatelessUserById(userId);
      this.repository.createUser(userToSave);
    }
    return returnCode;

  }

  public async findUserByIdentifier(identifier: string): Promise<string> {
    await this._updateOrganisation();
    return this._organisation.findUserByIdentifier(identifier);
  }

  public async createUser(user: StatelessUser): Promise<string> {
    await this._updateOrganisation();
    const userId: string = this._organisation.addUser(user);
    if (userId) {
      const userToSave: StatelessUser = this._organisation.getStatelessUserById(userId);
      this.repository.createUser(userToSave);
      return userId;
    }
    throw new Error("Something was wrong in user creation.");
  }

  public async deleteUser(id: string): Promise<ReturnCodes> {
    await this._updateOrganisation();
    const returnCode = this._organisation.deleteUser(id);
    if (returnCode === ReturnCodes.REMOVED) {
      this.repository.deleteUser(id);
    }
    return returnCode;
  }

  public async verifyUserPassword(id: string, password: string): Promise<boolean> {
    await this._updateOrganisation();
    return this._organisation.verifyUserPassword(id, password);
  }

  // GROUPS
  public async getGroups(): Promise<Group[]> {
    await this._updateOrganisation();
    return this._organisation.getGroups();
  }

  public async getGroup(id: string): Promise<Group> {
    await this._updateOrganisation();
    return this._organisation.getGroup(id);
  }

  public async createGroup(group: Group): Promise<string> {
    await this._updateOrganisation();
    const groupId = this._organisation.addGroup(group);
    if (groupId) {
      this.repository.createGroup(group);
    }
    return groupId;
  }

  public async updateGroup(group: Group): Promise<ReturnCodes> {
    await this._updateOrganisation();
    const returnCode = this._organisation.updateGroup(group);
    if (returnCode === ReturnCodes.UPDATED) {
      this.repository.updateGroup(group);
    }
    return returnCode;
  }

  public async getUsersNumberByGroup(id: string): Promise<string> {
    await this._updateOrganisation();
    return this._organisation.getUsersNumberByGroup(id)
  }

  public async deleteGroup(groupId: string): Promise<ReturnCodes> {
    await this._updateOrganisation();
    const returnCode = this._organisation.deleteGroup(groupId);
    if (returnCode === ReturnCodes.REMOVED) {
      this.repository.deleteGroup(groupId);
    }
    return returnCode;
  }

  private async _updateOrganisation() {
    if (!this._organisation) {
      this._organisation = await this.repository.readAsync();
    }
  }
}
