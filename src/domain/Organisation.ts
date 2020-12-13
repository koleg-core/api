import { v4 as uuid } from 'uuid';

import { ReturnCodes } from './enums/return-codes.enum';
import { Group } from './group/Group';
import { GroupProperties } from './group/GroupProperties';
import { User } from './user/User';
import { SshKey } from './user/SshKey';
import { UserIdentity } from './user/UserIdentity';
import { PhoneNumber } from './user/PhoneNumber';
import { Password } from './user/Password';
import { Job } from './user/Job';
import { UserProperties } from './user/UserProperties';

// This is the aggregate
export class Organisation {
    private _id: string
    private _groups: Group[] = [];
    private _users: User[] = [];

    constructor(
        private _name: string,
        private _description: string,
    ){
        this._id = uuid();
    }

    public getId(): string {
        return this._id;
    }

    public getName(): string {
        return this._name;
    }

    public setName(name: string): ReturnCodes {
        if(!name) {
            throw new Error('Invalid argument name: string');
        }

        if(name === this._name) {
            return ReturnCodes.NOTHING_CHANGED;
        }
        this._name = name;
        return ReturnCodes.UPDATED;
    }

    public getDescription(): string {
        return this._description;
    }

    public setDescription(description: string): ReturnCodes {
        if(!description) {
            throw new Error('Invalid argument name: string');
        }

        if(description === this._description) {
            return ReturnCodes.NOTHING_CHANGED;
        }
        this._description = description;
        return ReturnCodes.UPDATED;
    }

    public containsGroupById(groupId: string): boolean {
        if(!this._getGroupById(groupId)) {
            return false;
        }
        return true;
    }

    public getGroupPropertiesById(groupId: string): GroupProperties {
        const group: Group = this._getGroupById(groupId);
        return group.getProperties();
    }

    public getUserById(groupId: string): UserProperties {
        const findedUsers: User[] = this._users.filter(group =>
            group.getId() === groupId);
        if(findedUsers.length > 1) {
            throw new Error('Find 2 or more corresponding group with this id.');
        }

        return findedUsers[0].getProperties();
    }

    public addGroup(
        name:string,
        description:string,
        imgUrl:URL = null,
        parentGroupId:string = null,
        childsGroupsId:string[] = []
    ): string {
        const parentGroup:Group = this._getGroupById(parentGroupId);
        const childsGroups:Group[] = [];

        childsGroupsId.forEach(childsGroupId => {
            const childGroup:Group = this._getGroupById(childsGroupId);
            childsGroups.push(childGroup);
        })
        const newGroup:Group = new Group(name, description, imgUrl, parentGroup, childsGroups);
        if(!newGroup) {
            throw new Error('Group was not created');
        }

        this._groups.push(newGroup);
        return newGroup.getId();
    }

    public addUser(
        identity: UserIdentity,
        password: Password,
        job: Job,
        birthdate: Date,
        groupsIds: string[] = [],
        profilePictureUrl: URL = null,
        sshKey: SshKey = null,
        phoneNumbers: PhoneNumber[] = null,
        expirationDate: Date = null
    ): string {

        const validGroupsIds:string[] = groupsIds
          .filter(existingGroupId => this.containsGroupById(existingGroupId));

        if(validGroupsIds.length !== groupsIds.length) {
            throw new Error('Invalid group Id in groupsIds: string[]');
        }

        const validGroups: Group[] = [];

        validGroupsIds
          .forEach(
              userGroupsId => {
               const group: Group = this._getGroupById(userGroupsId);
               validGroups.push(group);
        });

        const newUser = new User(
            identity,
            password,
            job,
            birthdate,
            validGroups,
            profilePictureUrl,
            sshKey,
            phoneNumbers,
            expirationDate
        )
        this._users.push(newUser);
        return newUser.getId();
    }

    // TODO: fill this functions
    public getUserByIdentifier(userIdentifier: string): string {
        return null;
    }

    // TODO: fill this functions
    public verifyUserPassword(userUuid: string, password: string): string {
        return null;
    }

    // TODO: fill this functions
    public getUserProperties(userUuid: string): UserProperties {
        return null;
    }

    private _getGroupById(groupId: string): Group {
        const findedGroups: Group[] = this._groups.filter(group =>
            group.getId() === groupId);
        if(findedGroups.length > 1) {
            throw new Error('Find 2 or more corresponding group with this id.');
        }

        if(findedGroups.length === 0) {
            return null;
        }

        return findedGroups[0];
    }
}