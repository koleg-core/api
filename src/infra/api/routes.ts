import express from "express";
import { AuthController } from "./controllers/auth.controller";
import { GroupsController } from "./controllers/groups.controller";
import { JobsController } from "./controllers/jobs.controller";
import { UsersController } from "./controllers/users.controller";
import { AuthService } from "../api/auth/auth.service";
import bodyParser from "body-parser";

export class Routes {
  private _authController: AuthController;
  private _groupsController: GroupsController;
  private _jobsController: JobsController;
  private _usersController: UsersController;

  constructor(
    private _app: express.Application,
    private _authService: AuthService
  ) {
    this._authController = new AuthController(_authService);
    this._groupsController = new GroupsController();
    this._jobsController = new JobsController();
    this._usersController = new UsersController();

    this._app.route("/").get((req, res) => {
      res.json({ msg: 'Hello World !' });
    });

    const jsonParser = bodyParser.json()
    const urlencodedParser = bodyParser.urlencoded({ extended: false })

    // this._app.post("/auth/login", jsonParser, (req, res) => {
    //     console.log(req.body);
    //     this._authController.login(req, res);
    // });

    this._app.post("/auth/login", this._authController.login);

    this._app.route("/auth/logout").get(this._authController.logout);

    // GROUPS
    this._app.route("/groups/").get(this._groupsController.index);

    // JOBS

    // USERS
  }
}
