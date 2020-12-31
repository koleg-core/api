import { App } from "app/app";
import { Api } from "infra/api/api";
import { organisationInMemory } from "infra/repos/organisation-in-memory.repository";
import { OrganisationInSqlRepository } from "infra/repos/organisation-in-sql.repository";
import { OrganisationService } from "app/organisation.service";
import {AssetsService} from "app/assets.service";
import {S3} from "infra/s3/S3";

const databaseURI = "postgres://postgres:B2fpKNTvon@db-develop-postgresql:5432/postgres";

const s3Client = new S3();
// TODO: move it into app.ts
const apiService: Api = new Api(
  new OrganisationService(organisationInMemory),
  new AssetsService(s3Client)
);
const application: App = new App(apiService);

application.start();
