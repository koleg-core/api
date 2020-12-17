import { Service } from 'typedi';

import { OrganisationRepository } from '../domain/OrganisationRepository';
import { Organisation } from '../domain/Organisation';
import { UserProperties } from '../domain/user/UserProperties';
import { GroupProperties } from '../domain/group/GroupProperties';

@Service('organisation.repository')
class OrganisationInMemory implements OrganisationRepository {
    private _organisation: Organisation;
    constructor() {
        this._organisation = new Organisation("demo organisation", "this is a memory organisation");
    }

    public save(organisation: Organisation): void {
        this._organisation = organisation;
        // return organisation.getId();
    }

    // public read(organisationId: string): string {
    //     const organisations: Organisation[] = this._bucket
    //       .filter(organisation => organisationId === organisation.getId());

    //     return organisations[0].getId();
    // }
    public read(): Organisation {
        return this._organisation;
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

export const factory = OrganisationInMemory;
export const organisationInMemory = new OrganisationInMemory();
export default organisationInMemory;
