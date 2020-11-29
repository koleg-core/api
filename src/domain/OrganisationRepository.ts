import { Organisation } from './Organisation';

export interface OrganisationRepository {
    save(organisation: Organisation): string;
    read(): string;
}