import { v4 as uuid } from 'uuid';

import { ReturnCodes } from './enums/return-codes.enum';
import { Group } from './group/Group';
import { GroupProperties } from './group/GroupProperties';
import { User } from './user/User';
import { Job } from './user/Job';
import { ReadableUser } from './user/ReadableUser';
import { StatelessUser } from './user/StatelessUser';

// This is the aggregate
export class Organisation {
    private _id: string
    private _groups: Group[] = [];
    private _users: User[] = [];
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
        if (this._getGroupById(groupId)) {
            return true;
        }
        return false;
    }

    public getGroupPropertiesById(groupId: string): GroupProperties {
        const group: Group = this._getGroupById(groupId);
        return group.getReadableProperties();
    }

    public addGroup(
        name: string,
        description: string,
        imgUrl: URL = null,
        parentGroupId: string = null,
        childsGroupsId: string[] = []
    ): string {
        const parentGroup: Group = this._getGroupById(parentGroupId);
        const childsGroups: Group[] = [];

        childsGroupsId.forEach(childsGroupId => {
            const childGroup: Group = this._getGroupById(childsGroupId);
            if (!this._getGroupById(childsGroupId)) {
                throw new Error(`Child group ${childsGroupId} does not exist.`);
            }
            childsGroups.push(childGroup);
        })
        const newGroup: Group = new Group(name, description, imgUrl, parentGroup, childsGroups);
        if (!newGroup) {
            throw new Error('Group was not created');
        }

        this._groups.push(newGroup);
        return newGroup.getId();
    }

    // ####################
    // ###### USERS #######
    // ####################

    public getUsersProperties(): ReadableUser[] {
        const usersProperties: ReadableUser[] = [];

        this._users.forEach(user => {
            usersProperties.push(user.getReadableProperties());
        })

        return usersProperties;
    }

    public containsUserById(userId: string): boolean {
        if (!userId)
            throw new Error('Invalid argument userId: string');

        if (this._getUserById(userId)) {
            return true;
        }
        return false;
    }

    public getReadableUserById(userId: string): ReadableUser {
        if (!userId)
            throw new Error('Invalid argument userId: string');

        const user: User = this._getUserById(userId);
        if (!user) {
            return null;
        }
        return user.getReadableProperties();
    }

    public addUser(statelessUser: StatelessUser): string {

        const userGroups: string[] = statelessUser.groupsIds;
        userGroups.forEach(groupId => {
            if (!this.containsGroupById(groupId)) {
                throw new Error(`Invalid groupId: ${groupId}`);
            }
        });

        const newUser = new User(statelessUser);

        this._users.push(newUser);
        return newUser.getId();
    }

    public deleteUser(userId: string): ReturnCodes {
        if (!userId)
            throw new Error('Invalid argument userId: string');

        const requestedUserIndex = this._users.findIndex(user => userId === user.getId());

        if (requestedUserIndex < 0)
            throw new Error('User not found')

        if (requestedUserIndex > 1)
            throw new Error('There is more than one user with this id')

        delete this._users[requestedUserIndex];
        return ReturnCodes.REMOVED;
    }

    // TODO: fill this functions
    public getUserByIdentifier(userIdentifier: string): string {
        return null;
    }

    // TODO: fill this functions
    public verifyUserPassword(userUuid: string, password: string): string {
        return null;
    }

    public updateUser(statelessUser: StatelessUser): ReturnCodes {
        if (!statelessUser) {
            throw new Error('Invalid argument statelessUser: StatelessUser')
        }
        if (!this.containsUserById(statelessUser.id)) {
            return ReturnCodes.NOT_FOUND;
        }
        if (!statelessUser.identity) {
            throw new Error('statelessUser.identity Should not be empty');
        }
        if (!statelessUser.groupsIds) {
            throw new Error('statelessUser.groupsIds Should not be empty');
        }

        const user: User = this._getUserById(statelessUser.id);
        user.updateIdentity(statelessUser.identity);

        if (Array.isArray(statelessUser.groupsIds) && statelessUser.groupsIds.length > 0) {

            statelessUser.groupsIds.some(groupId => {
                if (!this.containsGroupById(groupId)) {
                    throw new Error(`Invalid groupId: ${groupId}`);
                }
            });

            user.updateGroups(statelessUser.groupsIds);
        }
        user.updateJob(statelessUser.job);
        if(statelessUser.birthdate) {
            user.updateBirthDate(statelessUser.birthdate);
        }
        if (statelessUser.password && !statelessUser.password.hasSameValue(user.getPassword())) {
            user.updatePassword(statelessUser.password);
        }
        if(statelessUser.profilePictureUrl) {
            user.updateProfilePictureUrl(statelessUser.profilePictureUrl);
        }
        if(statelessUser.sshKey) {
            user.updateSshKey(statelessUser.sshKey);
        }

        // return ReturnCodes.NOTHING_CHANGED;
        return ReturnCodes.UPDATED;
    }

    // ####################
    // ####### JOBS #######
    // ####################

    public getJobs(): Job[] {
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

        if (!requestedJob)
            throw new Error('Job not found')

        return requestedJob;
    }

    public deleteJob(jobName: string): ReturnCodes {
        const requestedJobIndex = this._jobs.findIndex(job => jobName === job.getName());

        if (requestedJobIndex < 0)
            return ReturnCodes.NOT_FOUND;

        this._users.splice(requestedJobIndex, 1);
        return ReturnCodes.REMOVED;
    }

    // ####################
    // ###### GROUPS ######
    // ####################

    private _getGroupById(groupId: string): Group {
        const foundGroups: Group[] = this._groups.filter(group =>
            group.getId() === groupId);
        if (foundGroups.length > 1) {
            throw new Error('Find 2 or more corresponding group with this id.');
        }

        if (foundGroups.length === 0) {
            return null;
        }

        return foundGroups[0];
    }

    private _containsInvalidGroupIds(groupsIds: string[]): boolean{
        groupsIds.some(groupId => {
            if (!this.containsGroupById(groupId)) {
                return true;
            }
        });
        return false;
    }

    // ###################
    // ###### USERS ######
    // ###################

    public _getUserById(groupId: string): User {
        const findedUsers: User[] = this._users.filter(group =>
            group.getId() === groupId);
        if (findedUsers.length > 1) {
            throw new Error('Find 2 or more corresponding user with this id.');
        }

        return findedUsers[0];
    }
}