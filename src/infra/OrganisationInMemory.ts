import { OrganisationRepository } from '../domain/OrganisationRepository';
import { Organisation } from '../domain/Organisation';
import { UserProperties } from '../domain/user/UserProperties';
import { GroupProperties } from '../domain/group/GroupProperties';

export class OrganisationInMemory implements OrganisationRepository {
    private _bucket: Organisation[] = [];

    public save(organisation: Organisation): string {
        this._bucket.push(organisation);
        return organisation.getId();
    }

    public read(organisationId: string): string {
        const organisations: Organisation[] = this._bucket
          .filter(organisation => organisationId === organisation.getId());

        return organisations[0].getId();
    }

    public saveUser(user: UserProperties): string {
        return null;
    }

    public readUser(organisationId: string): string {
        return null;
    }

    public saveGroup(groupProperties: GroupProperties): string {
        return null;
    }

    public readGroup(groupId: string): string {
        return null;
    }
}