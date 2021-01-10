import {
  Body,
  JsonController,
  Post,
} from "routing-controllers";
import {
  ResponseSchema,
  OpenAPI,
} from "routing-controllers-openapi";
import {
  Inject,
  Service,
} from "typedi";

import { compareSync } from "bcrypt";
import { ApiError } from "../errors/api-error";
import { HttpStatusCode } from "../models/http-status-code.enum";
import { StatelessUser } from "domain/user/StatelessUser";
import { OrganisationService } from "app/organisation.service";
import { ResponseModel } from "../models/response.model";
import jwt from "jsonwebtoken";
import { AuthService } from "../auth/auth.service";

@Service("auth.controller")
@JsonController("/auth")
export class AuthController {

  @Inject("auth.service")
  public authService: AuthService;

  @Inject("organisation.service")
  private _organisationService: OrganisationService;

  @OpenAPI({
    description: "Try to login by requesting JWT"
  })
  @ResponseSchema(ResponseModel, {
    contentType: "application/json",
    description: "Response model with JWT.",
    statusCode: "200"
  })
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

    if (!statelessUser.password || (statelessUser.password && !statelessUser.password.getValue())) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED, 'Invalid argument username or/and password');
    }

    const isPasswordValid = compareSync(credentials.password, statelessUser.password.getValue());

    if (!isPasswordValid) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED, "Invalid argument username or/and password");
    }

    const readableUser = await this._organisationService.getUserById(userId);

    if (!readableUser) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED, "Invalid argument username or/and password");
    }

    return new ResponseModel(HttpStatusCode.OK, "Success",
      {
        user: readableUser,
        token: this.authService.generateJwt(readableUser.getId(), readableUser.getIdentity().username)
      }
    );
  }
}
