import { Job } from '../../domain/user/Job';
import { Organisation } from '../Organisation';

export interface OrganisationRepository {
    // While we don't have many organisation,
    // we juste store unique organisation without Id
    // save(organisation: Organisation): string;
    // read(organisationId: string): string;
    save(organisation: Organisation): void;
    read(): Organisation;
    readAsync(): Promise<Organisation>;

    createJob(organisation: Organisation): any;


    // saveUser(user: UserProperties): string;
    // readUser(userId: string): string;

    // saveGroup(group: GroupProperties): string;
    // readGroup(groupId: string): string;

    // readJobs(): Promise<Job[]>;
}