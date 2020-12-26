import { v4 as uuid } from 'uuid';

import { ReturnCodes } from './enums/return-codes.enum';
import { Group } from './group/Group';
import { ReadableGroup } from './group/readableGroup';
import { User } from './user/User';
import { UserIdentity } from './user/UserIdentity';
import { Job } from './user/Job';
import { ReadableUser } from './user/ReadableUser';
import { StatelessUser } from './user/StatelessUser';

// This is the aggregate
export class Organisation {
    private _id: string
    private _groups: Map<string, Group> = new Map();
    private _users: Map<string, User> = new Map();
    private _jobs: Job[] = [];

    constructor(
        private _name?: string,
        private _description?: string,
    ) {
      this._id = uuid();
    }

    public getId(): string {
      return this._id;
    }

    public getName(): string {
      return this._name;
    }

    public setName(name: string): ReturnCodes {
      if (!name) {
        throw new Error('Invalid argument name: string');
      }

      if (name === this._name) {
        return ReturnCodes.NOTHING_CHANGED;
      }
      this._name = name;
      return ReturnCodes.UPDATED;
    }

    public getDescription(): string {
      return this._description;
    }

    public setDescription(description: string): ReturnCodes {
      if (!description) {
        throw new Error('Invalid argument name: string');
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

    public addGroup(
      id: string,
      name: string,
      description: string,
      parentGroupId: string = null,
      childsGroupsId?: string[],
      imgUrl?: URL
    ): string {

      if(id === undefined) {
        throw new Error(`Child group should be defined or null.`);
      }
      const parentGroup: Group = this._groups.get(parentGroupId);
      const childsGroups: Group[] = [];

      if(childsGroupsId) {
        childsGroupsId.forEach(childsGroupId => {
          if (!this._groups.has(childsGroupId)) {
            throw new Error(`Child group ${childsGroupId} does not exist.`);
          }
          const childGroup: Group = this._groups.get(childsGroupId);
          childsGroups.push(childGroup);
        })
      }
      const newGroup: Group = new Group(
        id,
        name,
        description,
        parentGroup,
        childsGroups,
        imgUrl || null
      );
      if (!newGroup) {
        throw new Error('Group was not created');
      }

      this._groups.set(newGroup.getId(), newGroup);
      return newGroup.getId();
    }

    // ####################
    // ###### USERS #######
    // ####################

    public getReadableUsers(): ReadableUser[] {
      const readableUsers: ReadableUser[] = [];

      this._users.forEach(user => {
        readableUsers.push(user.getReadable());
      })

      return readableUsers;
    }

    public containsUserById(userId: string): boolean {
      if (!userId)
        throw new Error('Invalid argument userId: string');

      if (this._users.get(userId)) {
        return true;
      }
      return false;
    }

    public getReadableUserById(userId: string): ReadableUser {
      if (!userId) {
        throw new Error('Invalid argument userId: string');
      }

      const user: User = this._users.get(userId);
      if (!user) {
        return null;
      }
      return user.getReadable();
    }

    public getStatelessUser(userId: string): StatelessUser {
      if (!userId) {
        throw new Error('Invalid argument userId: string');
      }
      if(!this._users.has(userId)) {
        throw new Error('There is no user with this id');
      }
      return this._users.get(userId).getStateLessUser();
    }

    public addUser(statelessUser: StatelessUser): string {
      if (!statelessUser) {
        throw new Error('Invalid argument statelessUser: StatelessUser');
      }
      console.log("ID", statelessUser.id);
      if(statelessUser.id) {
        throw new Error(
          `Invalid argument statelessUser can't had id, please use updateUser() instead.`
        );
      }
      const userGroups: string[] = statelessUser.groupsIds;
      userGroups.forEach(groupId => {
        if (!this._groups.has(groupId)) {
          throw new Error(`Invalid groupId: ${groupId}`);
        }
      });

      const newUser = new User(statelessUser);
      this._users.forEach(user => {
        const identity: UserIdentity = user.getIdentity();
        if(identity.controlWithIdentity(newUser.getIdentity())) {
          throw new Error('User already exist.');
        }

      })

      this._users.set(newUser.getId(), newUser);

      return newUser.getId();
    }

    public deleteUser(userId: string): ReturnCodes {
      if (!userId) {
        throw new Error('Invalid argument userId: string');
      }

      if(!this._users.has(userId)) {
        return ReturnCodes.NOT_FOUND;
      }

      this._users.delete(userId);
      return ReturnCodes.REMOVED;
    }

    // TODO: fill this functions
    public getUserByIdentifier(userIdentifier: string): string {
      throw Error('Not implemented yet');
    }

    // TODO: fill this functions
    public verifyUserPassword(userUuid: string, password: string): string {
      return null;
    }

    public updateUser(statelessUser: StatelessUser): ReturnCodes {
      if (!statelessUser) {
        throw new Error('Invalid argument statelessUser: StatelessUser')
      }
      if(!statelessUser.id) {
        throw new Error(
          'Invalid argument statelessUser.id should be setted, or use addUser instead.'
        );
      }
      if (!this._users.has(statelessUser.id)) {
        return ReturnCodes.NOT_FOUND;
      }
      if (!statelessUser.identity) {
        throw new Error('statelessUser.identity Should not be empty');
      }

      const user: User = this._users.get(statelessUser.id);
      user.updateIdentity(statelessUser.identity);

      if (Array.isArray(statelessUser.groupsIds) && statelessUser.groupsIds.length > 0) {

        statelessUser.groupsIds.some(groupId => {
          if (!this._groups.has(groupId)) {
            throw new Error(`Invalid groupId: ${groupId}`);
          }
        });

        user.updateGroups(statelessUser.groupsIds);
      }
      user.updateJob(statelessUser.job);
      if (statelessUser.birthdate) {
        user.updateBirthDate(statelessUser.birthdate);
      }
      if (statelessUser.password && !statelessUser.password.hasSameValue(user.getPassword())) {
        user.updatePassword(statelessUser.password);
      }
      if (statelessUser.profilePictureUrl) {
        user.updateProfilePictureUrl(statelessUser.profilePictureUrl);
      }
      if (statelessUser.sshKey) {
        user.updateSshKey(statelessUser.sshKey);
      }

      // return ReturnCodes.NOTHING_CHANGED;
      return ReturnCodes.UPDATED;
    }

    // ####################
    // ####### JOBS #######
    // ####################

    public getJobs(filter?:string): Job[] {
      return this._jobs;
    }

    public containsJob(givenJob: Job): boolean {
      if (this._jobs.some(job => job.equals(givenJob))) {
        return true;
      }

      return false
    }

    public addJob(newJob: Job): ReturnCodes {
      if (this.containsJob(newJob)) {
        return ReturnCodes.CONFLICTING;
      }

      this._jobs.push(newJob);
      return ReturnCodes.CREATED;
    }

    public getJob(name: string): Job {
      const queryJob = new Job(name);
      const requestedJob = this._jobs.find(job => job.equals(queryJob));

      if (!requestedJob) {
        throw new Error('Job not found')
      }

      return requestedJob;
    }

    public deleteJob(jobName: string): ReturnCodes {
      const requestedJobIndex = this._jobs.findIndex(job => jobName === job.getName());

      if (requestedJobIndex < 0) {
        return ReturnCodes.NOT_FOUND;
      }

      const deleteJobs = this._jobs.splice(requestedJobIndex, 1);
      // Wipe users jobs
      this._users.forEach(user => {
        if( this._jobs[requestedJobIndex].equals(user.getJob())){
          user.updateJob(null);
        }
      });

      if (deleteJobs[0].getName() === jobName) {
        return ReturnCodes.REMOVED;
      } else {
        throw new Error('Failure to delete the user');
      }
    }
}
