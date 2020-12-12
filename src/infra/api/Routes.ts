import express from "express";
import { Request, Response } from "express";
import { AuthController } from "./controllers/auth.controller";
import { GroupsController } from "./controllers/groups.controller";
import { JobsController } from "./controllers/jobs.controller";
import { UsersController } from "./controllers/users.controller";

export class Routes {

  public authController: AuthController = new AuthController();
  public groupsController: GroupsController = new GroupsController();
  public jobsController: JobsController = new JobsController();
  public usersController: UsersController = new UsersController();

  public routes(app: express.Application): void {
    app.route("/").get();

    // AUTH
    app.route("/auth/login").get(this.authController.login);
    app.route("/auth/logout").get(this.authController.logout);

    // GROUPS
    app.route("/groups/login").get(this.groupsController.index);

    // JOBS

    // USERS
  }
}
