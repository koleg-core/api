import { OrganisationService } from "app/organisation.service";
import { ReadableUser } from "domain/user/ReadableUser";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Action } from "routing-controllers";
import HttpStatusCode from "../models/http-status-code.enum";

export class AuthService {

  constructor(
    private _organisationService: OrganisationService
  ) { }

  public currentUserChecker(action: Action): Promise<ReadableUser> {
    const userId = action.response.locals.jwtPayload.data.userId;
    console.log(userId);
    return this._organisationService.getUserById(userId);
  }

  public static checkJwt(req: Request, res: Response, next: NextFunction) {

    const token = AuthService._extractTokenFromHeader(req);
    let jwtPayload;

    try {
      jwtPayload = jwt.verify(token, 'coucou-c-le-secret') as { userId: string, username: string };
      res.locals.jwtPayload = jwtPayload;
    } catch (error) {
      res.status(HttpStatusCode.UNAUTHORIZED).send({ response: "You should be logged in to access this url" });
      return;
    }

    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ data: { userId, username } }, 'coucou-c-le-secret', {
      expiresIn: "10h"
    });
    res.setHeader('Authorization', `Bearer ${newToken}`);

    next();
  }

  private static _extractTokenFromHeader = (req: Request) => {
    const authorization = req.headers.authorization;
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
      return authorization.split(' ')[1];
    }
  }
}