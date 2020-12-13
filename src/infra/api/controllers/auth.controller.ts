import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import {
  IVerifyOptions
} from "passport-local";

import { UserIdentity } from "../../../domain/user/UserIdentity";
import { UserProperties } from "../../../domain/user/UserProperties";
import { AuthService } from "../auth/auth.service";

export class AuthController {

  constructor(
    private _authService: AuthService
  ) { }

  public async login(req: Request, res: Response): Promise<void> {
    if (!req) {
      throw new Error('Invalid argument req: Request or req.body is udefined');
    }
    if (!req.body) {
      throw new Error('Invalid argument req.body');
    }

    if (!res) {
      throw new Error('Invalid argument res: Response is udefined');
    }

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
    res.json({
      message: "logout"
    })
  }
}