import { Job } from "../../domain/user/Job";
import { Organisation } from "../organisation";
import { StatelessUser } from "../../domain/user/StatelessUser";

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
    updateJob(job: Job): void;

    // User
    createUser(user: StatelessUser): void;
    updateUser(user: StatelessUser): void;
    deleteUser(userId: string): void;
    updateUserPassword(userId: string, password: string): void;

    // Group
    createGroup(organisation: Organisation, groupId: string): void;
    updateGroup(organisation: Organisation, groupId: string): void;
    deleteGroup(organisation: Organisation, groupId: string): void;
}
