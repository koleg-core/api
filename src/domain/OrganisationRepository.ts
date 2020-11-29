import { Organisation } from './Organisation';
import { UserProperties } from './user/UserProperties';
import { GroupProperties } from './group/GroupProperties';

export interface OrganisationRepository {
    save(organisation: Organisation): string;
    read(organisationId: string): string;

    saveUser(user: UserProperties): string;
    readUser(userId: string): string;

    saveGroup(group: GroupProperties): string;
    readGroup(groupId: string): string;
}