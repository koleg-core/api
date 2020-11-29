import { OrganisationRepository } from '../domain/OrganisationRepository';
import { Organisation } from '../domain/Organisation';


export class OrganisationInMemory implements OrganisationRepository {
    constructor(
        private bucket: Organisation[]
    ) {}

    public save(organisation: Organisation): string {
        this.bucket.push(organisation);
        return organisation.getId();
    }

    public read(organisationId: string): string {
        const organisations: Organisation[] = this.bucket
          .filter(organisation => organisationId === organisation.getId());

        return organisations[0].getId();
    }
}