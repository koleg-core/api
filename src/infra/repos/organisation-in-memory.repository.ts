import { Service } from 'typedi';

import { OrganisationRepository } from '../../domain/repos/organisation.repository';
import { Organisation } from '../../domain/Organisation';
import { ReadableUser } from '../../domain/user/ReadableUser';
import { GroupProperties } from '../../domain/group/GroupProperties';
import { Job } from '../../domain/user/Job';

@Service('organisation.repository')
class OrganisationInMemoryRepository implements OrganisationRepository {
    private _organisation: Organisation;

    constructor() {
        this._organisation = new Organisation("demo organisation", "this is a memory organisation");
    }
    save(organisation: Organisation): void {
        throw new Error('Method not implemented.');
    }
    read(): Organisation {
        throw new Error('Method not implemented.');
    }
    readAsync(): Promise<Organisation> {
        throw new Error('Method not implemented.');
    }
    createJob(job: Job): void {
        throw new Error('Method not implemented.');
    }
    deleteJob(name: string): void {
        throw new Error('Method not implemented.');
    }
    createUser(organisation: Organisation, userId: string): void {
        throw new Error('Method not implemented.');
    }
    updateUser(organisation: Organisation, userId: string): void {
        throw new Error('Method not implemented.');
    }
    deleteUser(organisation: Organisation, userId: string): void {
        throw new Error('Method not implemented.');
    }
    createGroup(organisation: Organisation, groupId: string): void {
        throw new Error('Method not implemented.');
    }
    updateGroup(organisation: Organisation, groupId: string): void {
        throw new Error('Method not implemented.');
    }
    deleteGroup(organisation: Organisation, groupId: string): void {
        throw new Error('Method not implemented.');
    }
}

export const factory = OrganisationInMemoryRepository;
export const organisationInMemory = new OrganisationInMemoryRepository();
export default organisationInMemory;
