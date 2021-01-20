import { v4 as uuid } from "uuid";

import { ReturnCodes } from "./enums/return-codes.enum";
import { Group } from "./group/Group";
import { ReadableGroup } from "./group/readableGroup";
import { User } from "./user/User";
import { UserIdentity } from "./user/UserIdentity";
import { Job } from "./user/Job";
import { ReadableUser } from "./user/ReadableUser";
import { StatelessUser } from "./user/StatelessUser";
import { Password } from "./user/Password";

// This is the aggregate
export class Organisation {
  private readonly _id: string
  private _groups: Map<string, Group> = new Map();
  private _users: Map<string, User> = new Map();
  private _jobs: Map<string, Job> = new Map();

  constructor(
    private _name?: string,
    private _description?: string,
  ) {
    this._id = uuid();
  }

  public getId(): string {
    return this._id;
  }

  public getDescription(): string {
    return this._description;
  }

  public setDescription(description: string): ReturnCodes {
    if (!description) {
      throw new Error("Invalid argument name: string");
    }

    if (description === this._description) {
      return ReturnCodes.NOTHING_CHANGED;
    }
    this._description = description;
    return ReturnCodes.UPDATED;
  }

  // ####################
  // ###### GROUPS ######
  // ####################

  public getGroups(): Group[] {
    return Array.from(this._groups.values());
  }

  public containsGroupById(groupId: string): boolean {
    if (this._groups.has(groupId)) {
      return true;
    }
    return false;
  }

  public getGroupPropertiesById(groupId: string): ReadableGroup {
    const group: Group = this._groups.get(groupId);
    return group.getReadableGroup();
  }

  public addGroupWithoutCheck(newGroup: Group): string {
    this._groups.set(newGroup.getId(), newGroup);
    return newGroup.getId();
  }

  public addGroup(newGroup: Group): { id: string, error: ReturnCodes } {
    const groups: Group[] = Array.from(this._groups.values());

    if (groups.some(group => newGroup.hasSameName(group))) {
      return {
        id: null,
        error: ReturnCodes.CONFLICTING
      };
    }

    if (newGroup.getParentId() && newGroup.getParentId() != null) {
      if (!this._groups.has(newGroup.getParentId())) {
        throw new Error('Parent doesnt exists.');
      }
    }

    if (Array.isArray(newGroup.getChildrenGroupsId()) && newGroup.getChildrenGroupsId().length > 0) {
      for (const groupId of newGroup.getChildrenGroupsId()) {
        if (this._groups.get(groupId)) {
          this._groups.get(groupId).setParentId(newGroup.getId());
        }
        else {
          throw new Error('Childs doesnt exists.');
        }
        if (groupId === newGroup.getParentId()) {
          throw new Error('Cannot have same group as parent and child');
        }
      }
    }

    if (newGroup.getParentId()) {
      const group = this._groups.get(newGroup.getParentId());
      if (group.getChildrenGroupsId().indexOf(newGroup.getId()) === -1) {
        group.addChild(newGroup.getId());
      }
    }

    this._groups.set(newGroup.getId(), newGroup);
    return {
      id: newGroup.getId(),
      error: null
    };
  }

  public getGroup(groupId: string): Group {
    const requestedGroup = this._groups.get(groupId);

    if (!requestedGroup) {
      throw new Error("Group not found");
    }

    return requestedGroup;
  }

  public updateGroup(updatedGroup: Group): ReturnCodes {

    const groups: Group[] = Array.from(this._groups.values());

    if (groups.some(group => updatedGroup.getId() !== group.getId() && updatedGroup.hasSameName(group))) {
      return ReturnCodes.CONFLICTING;
    }

    const groupToUpdate = this._groups.get(updatedGroup.getId());

    if (groupToUpdate) {
      const newUpdatedGroup: Group = new Group(
        groupToUpdate.getId(),
        updatedGroup.getName(),
        updatedGroup.getDescription(),
        updatedGroup.getParentId(),
        updatedGroup.getChildrenGroupsId() ? updatedGroup.getChildrenGroupsId() : groupToUpdate.getChildrenGroupsId(),
        groupToUpdate.getImgUrl(), // TODO : change since cannot update image from group update endpoint
        groupToUpdate.getCreationDate(),
        new Date()
      );
      const groups: Group[] = Array.from(this._groups.values());

      if (newUpdatedGroup.getParentId() && newUpdatedGroup.getParentId() != null) {
        if (!this._groups.has(newUpdatedGroup.getParentId())) {
          throw new Error('Parent doesnt exists.');
        }
        if (newUpdatedGroup.getParentId() === newUpdatedGroup.getId()) {
          throw new Error('Group cant be his self parent');
        }
      }

      if (Array.isArray(newUpdatedGroup.getChildrenGroupsId()) && newUpdatedGroup.getChildrenGroupsId().length > 0) {
        for (const groupId of newUpdatedGroup.getChildrenGroupsId()) {
          if (groupId === newUpdatedGroup.getId()) {
            throw new Error('This group cant have himself as child');
          }
          if (this._groups.get(groupId)) {
            this._groups.get(groupId).setParentId(newUpdatedGroup.getId());
          }
          else {
            throw new Error('Childs doesnt exists.');
          }
          if (groupId === newUpdatedGroup.getParentId()) {
            throw new Error('Cannot have same group as parent and child');
          }
        }
      }

      else {
        groups.forEach(group => {
          if (group.getParentId() === newUpdatedGroup.getId()) {
            group.setParentId(null);
          }
        });
      }

      if (newUpdatedGroup.getParentId()) {
        const group = this._groups.get(newUpdatedGroup.getParentId());
        if (group.getChildrenGroupsId().indexOf(newUpdatedGroup.getId()) === -1) {
          group.addChild(newUpdatedGroup.getId());
        }
      }
      else {
        groups.forEach(group => {
          group.deleteChildren(groupToUpdate.getId());
        });
      }
      this._groups.set(groupToUpdate.getId(), newUpdatedGroup);
      return ReturnCodes.UPDATED;
    } else {

      return ReturnCodes.NOT_FOUND;
    }
  }

  public deleteGroup(groupId: string): ReturnCodes {
    const isGroupDeleted = this._groups.delete(groupId);

    if (!isGroupDeleted) {
      return ReturnCodes.NOT_FOUND;
    } else {
      const groups: Group[] = Array.from(this._groups.values());

      groups.forEach(group => {
        group.deleteChildren(groupId);
        if (group.getParentId() === groupId) {
          group.setParentId(null);
        }
        this._groups.set(group.getId(), group);
      });

      const users: User[] = Array.from(this._users.values());

      users.forEach(user => {
        user.deleteGroupById(groupId);
        this._users.set(user.getId(), user);
      });

      return ReturnCodes.REMOVED;
    }
  }

  public getGroupById(groupId: string): Group {
    if (!groupId) {
      throw new Error("Invalid argument userId: string");
    }
    if (!this._groups.has(groupId)) {
      throw new Error("There is no user with this id");
    }
    return this._groups.get(groupId);
  }

  public updateGroupProfilePictureUrl(id: string, profilePictureUrl: URL): ReturnCodes {
    const group = this._groups.get(id);
    return group.updateImgUrl(profilePictureUrl);
  }

  // ####################
  // ###### USERS #######
  // ####################

  public getReadableUsers(): ReadableUser[] {
    const readableUsers: ReadableUser[] = [];

    this._users.forEach(user => {
      readableUsers.push(user.getReadable());
    });

    return readableUsers;
  }

  public containsUserById(userId: string): boolean {
    if (!userId)
      throw new Error("Invalid argument userId: string");

    if (this._users.get(userId)) {
      return true;
    }
    return false;
  }

  public getReadableUserById(userId: string): ReadableUser {
    if (!userId) {
      throw new Error("Invalid argument userId: string");
    }

    const user: User = this._users.get(userId);
    if (!user) {
      return null;
    }
    return user.getReadable();
  }

  public getStatelessUserById(userId: string): StatelessUser {
    if (!userId) {
      throw new Error("Invalid argument userId: string");
    }
    if (!this._users.has(userId)) {
      throw new Error("There is no user with this id");
    }
    return this._users.get(userId).getStateLessUser();
  }

  public addUser(statelessUser: StatelessUser): string {
    if (!statelessUser) {
      throw new Error("Invalid argument statelessUser: StatelessUser");
    }

    if (!statelessUser.birthdate) {
      throw new Error("Invalid argument statelessUser.birthdate: Date");
    }

    if (statelessUser.jobId) {
      if (!this.getJob(statelessUser.jobId)) {
        throw new Error("Invalid argument statelessUser.job: Job");
      }
    }

    if (Array.isArray(statelessUser.groupsIds) && statelessUser.groupsIds.length > 0) {
      const userGroups: string[] = statelessUser.groupsIds;
      userGroups.forEach(groupId => {
        if (!this._groups.has(groupId)) {
          throw new Error(`Invalid groupId: ${groupId}`);
        }
      });
    }

    const newUser = new User(statelessUser);

    this._users.forEach(user => {
      const identity: UserIdentity = user.getIdentity();
      if (identity.controlWithIdentity(newUser.getIdentity())) {
        throw new Error("User already exist.");
      }
    });

    this._users.set(newUser.getId(), newUser);

    return newUser.getId();
  }

  public deleteUser(userId: string): ReturnCodes {
    if (!userId) {
      throw new Error("Invalid argument userId: string");
    }

    if (!this._users.has(userId)) {
      return ReturnCodes.NOT_FOUND;
    }

    this._users.delete(userId);
    return ReturnCodes.REMOVED;
  }

  public findUserByIdentifier(userIdentifier: string): string {
    let foundUser: User = null;
    this._users.forEach(user => {
      if (user.getIdentity().email === userIdentifier || user.getIdentity().username === userIdentifier) {
        foundUser = user;
        return;
      }
    })
    if (foundUser) {
      return foundUser.getId();
    }
    return null;
  }

  public verifyUserPassword(userUuid: string, password: string): boolean {
    let foundUser: User = null;
    this._users.forEach(user => {
      if (userUuid === user.getId()) {
        foundUser = user;
      }
    });
    if (foundUser) {
      return password === foundUser.getPassword().getValue();
    }
    return false;
  }

  public updateUser(statelessUser: StatelessUser): ReturnCodes {
    if (!statelessUser) {
      throw new Error("Invalid argument statelessUser: StatelessUser");
    }
    if (!statelessUser.id) {
      throw new Error(
        "Invalid argument statelessUser.id should be setted, or use addUser instead."
      );
    }
    if (!this._users.has(statelessUser.id)) {
      return ReturnCodes.NOT_FOUND;
    }

    if (!statelessUser.identity) {
      throw new Error("statelessUser.identity Should not be empty");
    }

    let returnCode: ReturnCodes = ReturnCodes.NOTHING_CHANGED;

    const user: User = this._users.get(statelessUser.id);
    if (statelessUser.identity) {
      returnCode = user.updateIdentity(statelessUser.identity);
    }

    if (Array.isArray(statelessUser.groupsIds)) {

      if (statelessUser.groupsIds.length > 0) {
        statelessUser.groupsIds.some(groupId => {
          if (!this._groups.has(groupId)) {
            throw new Error(`Invalid groupId: ${groupId}`);
          }
        });
      }

      returnCode = user.updateGroups(statelessUser.groupsIds);
      if (returnCode < 0) {
        return returnCode;
      }

      returnCode = ReturnCodes.UPDATED;
    }

    if (statelessUser.jobId) {
      if (!this.getJob(statelessUser.jobId)) {
        throw new Error("Invalid argument statelessUser.job: Job");
      }
      user.updateJobId(statelessUser.jobId);
    }

    if (statelessUser.birthdate
      && user.getBirthDate() !== statelessUser.birthdate
    ) {
      returnCode = user.updateBirthDate(statelessUser.birthdate);
      if (returnCode < 0) {
        return returnCode;
      }
      returnCode = ReturnCodes.UPDATED;
    }

    if (Array.isArray(statelessUser.phoneNumbers)) {
      const userPhones = [...user.getPhoneNumbers()];
      userPhones.forEach(userPhone => {
        user.removePhoneNumber(userPhone);
      });

      if (statelessUser.phoneNumbers.length > 0) {
        statelessUser.phoneNumbers.forEach(userPhone => {
          user.addPhoneNumber(userPhone);
        });
      }
    }

    if (statelessUser.sshKey) {
      returnCode = user.updateSshKey(statelessUser.sshKey);
      if (returnCode < 0) {
        return returnCode;
      }
      returnCode = ReturnCodes.UPDATED;
    }

    if (statelessUser.disableDate) {
      user.disable();
    } else {
      user.enable();
    }

    returnCode = user.updateExpirationDate(statelessUser.expirationDate);
    if (returnCode < 0) {
      return returnCode;
    }
    returnCode = ReturnCodes.UPDATED;

    // console.log("NEW USER", user);
    this._users.set(user.getId(), user);
    return returnCode;
  }

  public updateUserProfilePictureUrl(id: string, profilePictureUrl: URL): ReturnCodes {
    const user = this._users.get(id);
    return user.updateProfilePictureUrl(profilePictureUrl);
  }

  public updateUserPassword(userId: string, newPassword: string): ReturnCodes {
    const user: User = this._users.get(userId);
    if (!user) {
      return ReturnCodes.NOT_FOUND;
    }

    return user.updatePassword(new Password(newPassword));
  }

  // ####################
  // ####### JOBS #######
  // ####################

  public getJobs(): Job[] {
    return Array.from(this._jobs.values());
  }

  public getJob(jobId: string): Job {
    const requestedJob = this._jobs.get(jobId);

    if (!requestedJob) {
      throw new Error("Job not found");
    }

    return requestedJob;
  }

  public addJob(newJob: Job): { id: string, error: ReturnCodes } {
    const jobs: Job[] = Array.from(this._jobs.values());

    if (jobs.some(job => newJob.hasSameName(job))) {
      return {
        id: null,
        error: ReturnCodes.CONFLICTING
      };
    }

    this._jobs.set(newJob.getId(), newJob);
    return { id: newJob.getId(), error: null };
  }

  public updateJob(updatedJob: Job): ReturnCodes {

    const jobs: Job[] = Array.from(this._jobs.values());

    if (jobs.some(job => updatedJob.getId() !== job.getId() && updatedJob.hasSameName(job))) {
      return ReturnCodes.CONFLICTING;
    }

    const jobToUpdate = this._jobs.get(updatedJob.getId());

    if (jobToUpdate) {
      const newUpdatedJob: Job = new Job(
        jobToUpdate.getId(),
        updatedJob.getName(),
        updatedJob.getDescription(),
        updatedJob.getIconUrl()
      );

      this._jobs.set(jobToUpdate.getId(), newUpdatedJob);
      return ReturnCodes.UPDATED;
    } else {
      return ReturnCodes.NOT_FOUND;
    }
  }

  public deleteJob(jobId: string): ReturnCodes {
    const isJobDeleted = this._jobs.delete(jobId);

    if (!isJobDeleted) {
      return ReturnCodes.NOT_FOUND;
    } else {
      const users: User[] = Array.from(this._users.values());

      // Wipe users jobs
      users.forEach(user => {
        if (jobId === user.getJobId()) {
          user.updateJobId(null);
        }
      });

      return ReturnCodes.REMOVED;
    }
  }

  public getUsersNumberByJob(jobId: string): string {
    const users: User[] = Array.from(this._users.values());

    return users
      .filter(user => jobId === user.getJobId())
      .length
      .toString();
  }

  public getUsersNumberByGroup(groupId: string): string {
    const users: User[] = Array.from(this._users.values());
    return users
      .filter(user => user.getGroupIds().indexOf(groupId) > -1)
      .length
      .toString();
  }
}
