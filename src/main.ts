import './app/app';
import { App } from './app/app';
import { Api } from './infra/api/api';
import { OrganisationInMemory } from './infra/OrganisationInMemory';

const repository: OrganisationInMemory = new OrganisationInMemory();
const apiService: Api = new Api(repository);
const application: App = new App(apiService, repository);

application.start()