import morgan from "morgan";
import "reflect-metadata"; // this shim is required
import {
  getMetadataArgsStorage,
  useContainer,
  createExpressServer,
  RoutingControllersOptions,
  Action
} from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import * as swaggerUiExpress from "swagger-ui-express";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { OpenAPIObject } from "openapi3-ts";
import { Container } from "typedi";
import { Application } from "express";

import { UsersController } from "./controllers/users.controller";
import { JobsController } from "./controllers/jobs.controller";
import { OrganisationService } from "app/organisation.service";
import { AssetsService } from "app/assets.service";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./auth/auth.service";

export class Api {
  private _app: Application;
  private _port = 8080;
  private readonly _routingControllersOptions: RoutingControllersOptions;
  private _spec: OpenAPIObject;
  private _swaggerOptions = {
    customCss: ".swagger-ui .topbar { display: none }"
  };

  constructor(
    private _organisationService: OrganisationService,
    private _assetsService: AssetsService,
    private _sessionDuration: string="1h",
    private _pageSize: number=10,
  ) {

    if (!this._organisationService) {
      throw new Error("Invalid argument _organisationService: OrganisationService is not defined.");
    }
    if (!this._assetsService) {
      throw new Error("Invalid argument _assetsService: AssetsService is not defined");
    }

    // TODO externalize it into config
    Container.set("saltRounds.security.config", 10);
    Container.set("organisation.service", this._organisationService);
    Container.set("assets.service", this._assetsService);

    // To have working typedi
    useContainer(Container);

    const authService = new AuthService(this._organisationService);

    this._routingControllersOptions = {
      classTransformer: true,
      validation: { skipMissingProperties: true },
      currentUserChecker: async (action: Action) => { return await authService.currentUserChecker(action); },
      controllers: [
        UsersController,
        JobsController,
        AuthController
      ]
    };

    this._app = createExpressServer(this._routingControllersOptions);
    // this._authService = new AuthService(this._repository);

    // TODO externalize log lever into config
    this._app.use(morgan("dev"));
  }

  public config(
    port: number,
    description?: string,
    title?: string,
    apiVersion?: string
  ): void {
    this._port = port;

    // TODO: schema is not working, fix it
    // Parse class-validator classes into JSON Schema:
    const schemas = validationMetadatasToSchemas();

    // Parse routing-controllers classes into OpenAPI spec:
    const storage = getMetadataArgsStorage();
    this._spec = routingControllersToSpec(
      storage,
      this._routingControllersOptions,
      { // TODO: externalize this into template file
        components: {
          schemas,
          securitySchemes: {
            basicAuth: {
              scheme: "basic",
              type: "http",
            },
          },
        },
        info: {
          description: description || "Koleg rest api",
          title: title || "Koleg 👩‍💼",
          version: apiVersion || "1.0.0",
        },
        externalDocs: {
          description: "Find out more about Swagger",
          url: "https://gitlab.com/koleg1/api/-/blob/develop/swagger/swagger.yml"
        },
        servers: [
          {
            url: "http://localhost:8080/",
            description: "Local development server"
          },
          {
            url: "https://api.koleg.nofreedisk.space/",
            description: "Development server"
          },
          {
            url: "https://api.staging.koleg.com/",
            description: "Staging server"
          },
          {
            url: "https://api.koleg.com/",
            description: "Production server"
          }
        ]
      });

    this._app.use(
      "/docs",
      swaggerUiExpress.serve,
      swaggerUiExpress.setup(this._spec, this._swaggerOptions)
    );
  }

  public start(): void {
    this._app.listen(this._port, () => console.log(`Koleg is listening on port ${this._port}!`));
    this._app.get("/", (_req, res) => {
      res.json(this._spec);
    });
  }

  // public getApp(): Application {
  //   return this._app;
  // }

  // private _config(authStrategy?: AuthStrategy[]): void {
  //   // this._app.use(bodyParser.urlencoded({ extended: false }));

  //   // TODO externalize it with configs passed into params
  //   this._authService.addAuthKind(AuthStrategy.LOGIN);
  //   this._authService.addAuthKind(AuthStrategy.JWT);
  // }
}
