import { Organisation } from './Organisation';
import { UserProperties } from './user/UserProperties';
import { GroupProperties } from './group/GroupProperties';

export interface OrganisationRepository {
    // While we don't have many organisation,
    // we juste store unique organisation without Id
    // save(organisation: Organisation): string;
    // read(organisationId: string): string;
    save(organisation: Organisation): void;
    read(): Organisation;

    saveUser(user: UserProperties): string;
    readUser(userId: string): string;

    saveGroup(group: GroupProperties): string;
    readGroup(groupId: string): string;
}