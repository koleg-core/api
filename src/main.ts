import { Organisation } from './domain/Organisation';
import './app/app';
import { App } from './app/app';
import { Api } from './infra/api/api';
import { organisationInMemory as repository } from './infra/OrganisationInMemory';
import { OrganisationInSql } from './infra/OrganisationInSql';

const org: Organisation = new Organisation("toto", "tto");

const databaseURI = 'postgres://postgres:B2fpKNTvon@db-develop-postgresql:5432/postgres';

const sqlRepository = new OrganisationInSql(
  databaseURI
);

repository.save(org);

const apiService: Api = new Api(sqlRepository);
const application: App = new App(apiService);

application.start()