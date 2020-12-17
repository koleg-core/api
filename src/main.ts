import { Organisation } from './domain/Organisation';
import './app/app';
import { App } from './app/app';
import { Api } from './infra/api/api';
import { organisationInMemory as repository } from './infra/OrganisationInMemory';

const org: Organisation = new Organisation("toto", "tto");

repository.save(org);

const apiService: Api = new Api(repository);
const application: App = new App(apiService);

application.start()