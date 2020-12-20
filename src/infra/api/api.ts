import morgan from "morgan";
import "reflect-metadata"; // this shim is required
import { useContainer, createExpressServer } from "routing-controllers";
import { UsersController } from "./controllers/users.controller"
import { Container } from 'typedi';

// import { Routes } from "./routes";
import { AuthService } from "../api/auth/auth.service";
import { Strategy as AuthStrategy } from "../api/auth/strategy.enum";
import { OrganisationRepository } from "../../domain/repos/organisation.repository";
import { Application } from "express";
import { JobsController } from "./controllers/jobs.controller";

export class Api {
  private _app: Application;
  private _authService: AuthService;
  private _port = 8080;

  constructor(
    private _repository: OrganisationRepository
  ) {

    if (!this._repository) {
      throw new Error('Invalid argument repository: OrganisationRepository is not defined.');
    }


    // TODO externalize it into config
    Container.set('saltRounds.security.config', 10);
    // Container.set('organisation.repository', this._repository);

    // To have working typedi
    useContainer(Container);


    this._app = createExpressServer({
      controllers: [
        UsersController,
        JobsController
      ]
    });
    // this._authService = new AuthService(this._repository);

    // TODO externalize log lever into config
    this._app.use(morgan('dev'));
  }

  public config(port: number) {
    this._port = port;
  }

  public start() {
    this._app.listen(this._port, () => console.log(`Koleg is listening on port ${this._port}!`));
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