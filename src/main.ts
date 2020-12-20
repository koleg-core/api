import { Organisation } from './domain/Organisation';
import './app/app';
import { App } from './app/app';
import { Api } from './infra/api/api';
import { organisationInMemory as repository } from './infra/repos/organisation-in-memory.repository';
import { OrganisationInSqlRepository } from './infra/repos/organisation-in-sql.repository';
import { OrganisationService } from './app/organisation.service';

const org: Organisation = new Organisation("toto", "tto");

const databaseURI = 'postgres://postgres:B2fpKNTvon@db-develop-postgresql:5432/postgres';

const sqlRepository = new OrganisationInSqlRepository(
  databaseURI
);

const apiService: Api = new Api(new OrganisationService(sqlRepository));
const application: App = new App(apiService);

application.start()