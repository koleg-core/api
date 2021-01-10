import { Body, JsonController, Post } from "routing-controllers";
import { Inject, Service } from "typedi";
import { compareSync } from "bcrypt";
import { ApiError } from "../errors/api-error";
import { HttpStatusCode } from "../models/http-status-code.enum";
import { StatelessUser } from "domain/user/StatelessUser";
import { OrganisationService } from "app/organisation.service";
import { ResponseModel } from "../models/response.model";
import jwt from "jsonwebtoken";
import { ReadableUser } from "domain/user/ReadableUser";

@Service("auth.controller")
@JsonController("/auth")
export class AuthController {

  @Inject("sessionDuration.api.config")
  private _sessionDuration: string;
  @Inject("jwtSecret.security.config")
  private _jwtSecret: string;


  @Inject("organisation.service")
  private _organisationService: OrganisationService;

  @Post("/login")
  async login(@Body() credentials: { identifier: string, password: string }): Promise<ResponseModel | ApiError> {
    if (!credentials.identifier) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED, "Invalid argument username or/and password");
    }

    if (!credentials.password) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED, "Invalid argument username or/and password");
    }

    const userId: string = await this._organisationService.findUserByIdentifier(credentials.identifier);
    if (!userId) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED, "Invalid argument username or/and password");
    }

    const statelessUser: StatelessUser = await this._organisationService.getUserByIdWithPassword(userId);

    const isPasswordValid = compareSync(credentials.password, statelessUser.password.getValue());

    if (!isPasswordValid) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED, "Invalid argument username or/and password");
    }

    const readableUser = await this._organisationService.getUserById(userId);

    if (!readableUser) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED, "Invalid argument username or/and password");
    }

    return new ResponseModel(HttpStatusCode.OK, "Success", { user: readableUser, token: this._generateJwt(readableUser) });
  }

  private _generateJwt(user: ReadableUser) {
    return jwt.sign({ data: { userId: user.getId(), username: user.getIdentity().username } },
      this._jwtSecret, { expiresIn: this._sessionDuration });
  }
}
