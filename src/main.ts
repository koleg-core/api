import { App } from "app/app";
import { ConfigService } from "app/config/config.service";
import { Api } from "infra/api/api";
import { organisationInMemory } from "infra/repos/organisation-in-memory.repository";
import { OrganisationInSqlRepository } from "infra/repos/organisation-in-sql.repository";
import { OrganisationService } from "app/organisation.service";
import { AssetsService } from "app/assets.service";
import { S3 } from "infra/s3/S3";


const config = new ConfigService();
config.init();

const dbConfig = config.getConfig("database");
const apiConfig = config.getConfig("api");
const s3config = config.getConfig("s3");

const s3Service = new AssetsService(
  new S3(
    s3config.port,
    s3config.use_ssl,
    s3config.access_key,
    s3config.secret_key,
    s3config.region,
    s3config.bucket,
    s3config.endpoint,
    s3config.path_style,
    s3config.apiVersion
  )
);

let organisationService: OrganisationService;

if(dbConfig.enable) {
  organisationService = new OrganisationService(new OrganisationInSqlRepository(
    dbConfig.user,
    dbConfig.password,
    dbConfig.host,
    dbConfig.port,
    dbConfig.schema
  ));
} else {
  organisationService = new OrganisationService(
    organisationInMemory,
  );
}

// TODO: move it into app.ts
const apiService: Api = new Api(
  organisationService,
  s3Service,
  apiConfig.session_duration,
  apiConfig.page_size,
  apiConfig.jwt_secret
);

const application: App = new App(apiService, apiConfig.port);

application.start();
