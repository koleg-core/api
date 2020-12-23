import { App } from 'app/app';
import { Api } from 'infra/api/api';
import { OrganisationInSqlRepository } from 'infra/repos/organisation-in-sql.repository';
import { OrganisationService } from 'app/organisation.service';

const databaseURI = 'postgres://postgres:B2fpKNTvon@db-develop-postgresql:5432/postgres';

const sqlRepository = new OrganisationInSqlRepository(
  databaseURI
);

const apiService: Api = new Api(new OrganisationService(sqlRepository));
const application: App = new App(apiService);

application.start()
