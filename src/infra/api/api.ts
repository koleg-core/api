import express from "express";
import bodyParser from "body-parser";

import { Routes } from "./routes";
import { AuthService } from "../api/auth/auth.service";
import { Strategy as AuthStrategy } from "../api/auth/strategy.enum";
import { OrganisationRepository } from "../../domain/OrganisationRepository";

export class Api {
  private _app: express.Application;
  private _authService: AuthService;
  private _routePrv: Routes;
  private _repository: OrganisationRepository;

  constructor(
    private repository: OrganisationRepository
  ) {

    this._app = express();
    this._repository = repository;
    this._authService = new AuthService(this._repository);
    this._routePrv = new Routes(this._app, this._authService);
    this._config();
  }

  public getApp() {
    return this._app;
  }

  private _config(authStrategy?: AuthStrategy[]): void {
    this._app.use(bodyParser.json());
    // this._app.use(bodyParser.urlencoded({ extended: false }));

    // TODO externalize it with configs passed into params
    this._authService.addAuthKind(AuthStrategy.LOGIN);
    this._authService.addAuthKind(AuthStrategy.JWT);
  }
}