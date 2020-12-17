import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import {
  IVerifyOptions
} from "passport-local";

import { UserIdentity } from "../../../domain/user/UserIdentity";
import { UserProperties } from "../../../domain/user/UserProperties";
import { AuthService } from "../auth/auth.service";
import { Controller } from "./controller";

export class AuthController extends Controller {

  constructor(
    private _authService: AuthService
  ) {
    super();
  }

  public async login(req: Request, res: Response): Promise<void> {
    super.validRequestParams(req, res);

    const { identifer, password } = req.body;

    this._authService.login(
      identifer,
      password,
      (error, user?: UserProperties, options?: IVerifyOptions) => {
        if (error) {
          res.status(500).json({ message: 'User password error' });
        }
        if (user) {
          const userIdentity: UserIdentity = user.getIdentity();
          const token: string = jwt.sign(
            { userIdentity },
            "SECRET", // TODO move SECRET into config file
            {
              expiresIn: 1000000, // TODO move into config
            }
          );
          const userToReturn: unknown = { "user": user, "token": token };

          res.status(200).json(userToReturn);
        }

        res.status(403).json(options.message);
      }
    );
  }

  public logout(req: Request, res: Response): void {
    super.validRequestParams(req, res);

    res.json({
      message: "logout"
    })
  }
}