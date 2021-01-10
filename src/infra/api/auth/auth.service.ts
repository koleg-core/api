import { OrganisationService } from "app/organisation.service";
import { ReadableUser } from "domain/user/ReadableUser";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Action } from "routing-controllers";
import { Inject, Service } from "typedi";
import HttpStatusCode from "../models/http-status-code.enum";

@Service('auth.service')
export class AuthService {

  @Inject("sessionDuration.api.config")
  private _sessionDuration: string;

  @Inject("jwtSecret.security.config")
  private _jwtSecret: string;

  constructor(
    private _organisationService: OrganisationService
  ) { }

  public currentUserChecker(action: Action): Promise<ReadableUser> {
    const userId = action.response.locals.jwtPayload.data.userId;
    return this._organisationService.getUserById(userId);
  }

  public checkJwt(req: Request, res: Response, next: NextFunction) {
    
    const token = this._extractTokenFromHeader(req);
    let jwtPayload;

    try {
      jwtPayload = jwt.verify(token, this._jwtSecret) as { userId: string, username: string };
      res.locals.jwtPayload = jwtPayload;
    } catch (error) {
      res.status(HttpStatusCode.UNAUTHORIZED).send({ response: "You should be logged in to access this url" });
      return;
    }

    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ data: { userId, username } }, this._jwtSecret, {
      expiresIn: this._sessionDuration
    });
    res.setHeader("Authorization", `Bearer ${newToken}`);

    next();
  }

  public generateJwt(userId: string, username: string) {
    return jwt.sign({ data: { userId: userId, username: username } },
      this._jwtSecret, { expiresIn: this._sessionDuration });
  }

  private _extractTokenFromHeader = (req: Request) => {
    const authorization = req.headers.authorization;
    if (authorization && authorization.split(" ")[0] === "Bearer") {
      return authorization.split(" ")[1];
    }
  }
}
