import { Service } from 'typedi';

import { OrganisationRepository } from '../../domain/repos/organisation.repository';
import { Organisation } from '../../domain/organisation';
import { Job } from '../../domain/user/Job';
import { StatelessUser } from '../../domain/user/StatelessUser';

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
    createUser(userId: string, user: StatelessUser): void {
        throw new Error('Method not implemented.');
    }
    updateUser(userId: string, user: StatelessUser): void {
        throw new Error('Method not implemented.');
    }
    deleteUser(userId: string): void {
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
