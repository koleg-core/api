import './application/App';
import { App } from './application/App';
import { OrganisationRepository } from './domain/OrganisationRepository';

import { Api } from './infra/api/Api';
import { OrganisationInMemory } from './infra/OrganisationInMemory';

const apiService: Api = new Api();
const repository: OrganisationInMemory = new OrganisationInMemory();
const application: App = new App(apiService, repository);

application.start()