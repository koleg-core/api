import { Job } from '../../domain/user/Job';
import { Organisation } from '../../domain/organisation';

export interface OrganisationRepository {
    // While we don't have many organisation,
    // we juste store unique organisation without Id
    // save(organisation: Organisation): string;
    // read(organisationId: string): string;
    save(organisation: Organisation): void;
    read(): Organisation;
    readAsync(): Promise<Organisation>;

    // Jobs
    createJob(job: Job): void;
    deleteJob(name: string): void;

    // User
    createUser(organisation: Organisation, userId: string): void;
    updateUser(organisation: Organisation, userId: string): void;
    deleteUser(organisation: Organisation, userId: string): void;

    // Group
    createGroup(organisation: Organisation, groupId: string): void;
    updateGroup(organisation: Organisation, groupId: string): void;
    deleteGroup(organisation: Organisation, groupId: string): void;
}