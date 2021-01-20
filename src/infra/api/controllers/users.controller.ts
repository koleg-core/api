import {
  Service,
  Inject
} from "typedi";
import Fuse from "fuse.js";
import {
  JsonController,
  UploadedFile,
  HttpCode,
  Body,
  Get,
  Post,
  Put,
  Delete,
  QueryParam,
  Param,
  BodyParam,
  UseBefore,
} from "routing-controllers";
import {
  ResponseSchema,
  OpenAPI,
} from "routing-controllers-openapi";

import { hash } from "bcrypt";

import { ReturnCodes } from "domain/enums/return-codes.enum";
import { StatelessUser } from "domain/user/StatelessUser";

import { OrganisationService } from "app/organisation.service";
import { AssetsService } from "app/assets.service";

import { ApiError } from "../errors/api-error";
import { WritableUserApiModel } from "../models/writable-user-api.model";
import { ResponseModel } from "../models/response.model";
import { HttpStatusCode } from "../models/http-status-code.enum";
import { ReadableUserApiModel } from "../models/readable-user-api.model";
import { VcardApiModel } from "infra/vcards/models/vcard-api-model";
import { ReadableUser } from "domain/user/ReadableUser";
import { CheckJwtMiddleware } from "../auth/check-jwt-middleware";

export const fileUploadOptions = {
  limits: {
    fieldNameSize: 255,
    fileSize: 4000000
  }
};

@Service("user.controller")
@JsonController()
export class UsersController {

  @Inject("saltRounds.security.config")
  private _saltRoudsPassword: number;

  @Inject("pageSize.api.config")
  private _pageSize: number;

  @Inject("organisation.service")
  private _organisationService: OrganisationService;

  @Inject("assets.service")
  private _assetService: AssetsService;
  private readonly _fuseOptions: Fuse.IFuseOptions<ReadableUser> = {
    includeScore: false,
    keys: [
      "id",
      "identity.firstName",
      "identity.lastName",
      "identity.username",
      "identity.email",
      "birthDate",
      "groupIds",
      "job.name",
      "phoneNumbers.value" // maybe duplication
    ] // This break private things, but don't care
  }

  @OpenAPI({
    description: "Query all users using filter or not.",
    security: [{ bearerAuth: [] }], // Applied to each method
  })
  @ResponseSchema(ReadableUserApiModel, {
    contentType: "application/json",
    description: "A list of users",
    isArray: true,
    statusCode: "200"
  })
  @Get("/users")
  @HttpCode(HttpStatusCode.OK)
  @UseBefore(CheckJwtMiddleware)
  async getAll(
    @QueryParam("filter") filter?: string,
    @QueryParam("page") page?: number,
    @QueryParam("itemsNumber") itemsNumber?: number
  ): Promise<ResponseModel | ApiError> {
    return this._organisationService.getUsers()
      .then(users => {
        let usersResponse: ReadableUserApiModel[] = [];
        if (Array.isArray(users) && users.length > 0) {

          if (filter) {
            const fuse: Fuse<ReadableUser> = new Fuse(users, this._fuseOptions);
            const fuzeUsers = fuse.search(filter);
            fuzeUsers.forEach(user => usersResponse.push(ReadableUserApiModel.toReadableUserApiModel(user.item)));
          } else {
            users.forEach(user => usersResponse.push(ReadableUserApiModel.toReadableUserApiModel(user)));
          }

          const realPage = page || 1;
          const realItemsNumber = itemsNumber || this._pageSize;

          if (realPage * realItemsNumber <= usersResponse.length) {
            usersResponse = usersResponse.slice((realPage - 1) * realItemsNumber, realPage * realItemsNumber);
          } else {
            usersResponse = usersResponse.slice((realPage - 1) * realItemsNumber, usersResponse.length);
          }

        }
        return new ResponseModel(HttpStatusCode.OK, "Success", usersResponse);
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @OpenAPI({
    description: "Create new user."
  })
  @ResponseSchema(ResponseModel, {
    contentType: "application/json",
    description: "Response model with user id",
    statusCode: "200"
  })
  @Post("/users")
  @HttpCode(HttpStatusCode.CREATED)
  @UseBefore(CheckJwtMiddleware)
  async post(@Body() user: WritableUserApiModel): Promise<ResponseModel | ApiError> {
    const statelessUser: StatelessUser = user.toStatelessUser();
    return this._organisationService.createUser(statelessUser)
      .then(id => {
        if (id) {
          this.uploadVcard(statelessUser, id);
          return new ResponseModel(HttpStatusCode.OK, `User created with id: ${id}.`, id);
        } else {
          throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, "User not created");
        }
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @OpenAPI({
    description: "Query user data using his id.",
    security: [{ bearerAuth: [] }], // Applied to each method
  })
  @ResponseSchema(ResponseModel, {
    contentType: "application/json",
    description: "Requested user",
    statusCode: "200"
  })
  @Get("/users/:id")
  @UseBefore(CheckJwtMiddleware)
  async get(@Param("id") id: string): Promise<ResponseModel | ApiError> {
    return this._organisationService.getUserById(id)
      .then(user => {
        if (!user) {
          throw new ApiError(HttpStatusCode.NOT_FOUND, ReturnCodes.NOT_FOUND, `There is not user with id: ${user.getId()}`);
        }
        return new ResponseModel(HttpStatusCode.OK, "Success", ReadableUserApiModel.toReadableUserApiModel(user));
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @OpenAPI({
    description: "Update user using his id.",
    security: [{ bearerAuth: [] }], // Applied to each method
  })
  @ResponseSchema(ResponseModel, {
    contentType: "application/json",
    description: "Response ",
    statusCode: "200"
  })
  @Put("/users/:id")
  @HttpCode(HttpStatusCode.OK)
  @UseBefore(CheckJwtMiddleware)
  async put(@Param("id") id: string, @Body() user: WritableUserApiModel): Promise<ResponseModel | ApiError> {
    const statelessUser = user.toStatelessUser(id);
    return this._organisationService.updateUser(statelessUser)
      .then(returnCode => {
        if (returnCode === ReturnCodes.NOT_FOUND) {
          throw new ApiError(HttpStatusCode.NOT_FOUND, ReturnCodes.NOT_FOUND, "User not found");
        }
        this.uploadVcard(statelessUser);
        return new ResponseModel(returnCode, `Request returns with status : ${returnCode}.`, id);
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @OpenAPI({
    description: "Remove user using his id.",
    security: [{ bearerAuth: [] }], // Applied to each method
  })
  @ResponseSchema(ResponseModel, {
    contentType: "application/json",
    description: "Response ",
    statusCode: "200"
  })
  @Delete("/users/:id")
  @UseBefore(CheckJwtMiddleware)
  async remove(@Param("id") id: string): Promise<ResponseModel | ApiError> {

    return this._organisationService.deleteUser(id)
      .then(returnCode => {
        this._assetService.deleteVcard(id);
        return new ResponseModel(returnCode, `Request returns with status : ${returnCode}.`);
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @OpenAPI({
    description: "Update user password.",
    security: [{ bearerAuth: [] }], // Applied to each method
  })
  @ResponseSchema(ResponseModel, {
    contentType: "application/json",
    description: "Response ",
    statusCode: "200"
  })
  @HttpCode(HttpStatusCode.ACCEPTED)
  @Put("/users/:id/update-password")
  @UseBefore(CheckJwtMiddleware)
  async updatePassword(@Param("id") userId: string, @BodyParam("password") password: string): Promise<ResponseModel | ApiError> {
    console.log(password);

    if (!password) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, HttpStatusCode.BAD_REQUEST, "The password must not be null or empty");
    }

    const readableUser = await this._organisationService.getUserById(userId);

    if (!readableUser) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, ReturnCodes.NOT_FOUND, "User not found");
    }

    return hash(password, this._saltRoudsPassword)
      .then(async hashedPassword => {
        try {
          const returnCode = await this._organisationService.updateUserPassword(userId, hashedPassword);
          if (returnCode !== ReturnCodes.UPDATED) {
            throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, returnCode, "User password cannot be changed.");
          }
          return new ResponseModel(HttpStatusCode.OK, `Your password changment for user: ${userId} was aknoleged.`);
        } catch (error) {
          throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
        }
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @OpenAPI({
    description: "Upload new profile picture on s3.",
    security: [{ bearerAuth: [] }], // Applied to each method
  })
  @ResponseSchema(ResponseModel, {
    contentType: "application/json",
    description: "Response ",
    statusCode: "200"
  })
  @HttpCode(HttpStatusCode.ACCEPTED)
  @Post("/users/:id/upload_image")
  @UseBefore(CheckJwtMiddleware)
  async uploadImage(@Param("id") id: string, @UploadedFile("profilePicture", { options: fileUploadOptions }) profilePicture: Express.Multer.File): Promise<ResponseModel | ApiError> {

    const newProfilePictureUrl: URL = this._assetService.uploadProfilePicture(id, profilePicture);
    this._organisationService.updateUserProfilePictureUrl(id, newProfilePictureUrl)
      .then(returnCode => {
        if (returnCode < 0) {
          throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, returnCode, "Profile picture was not updated");
        }
      });
    return new ResponseModel(HttpStatusCode.ACCEPTED, "User profile picture will be updated", newProfilePictureUrl.href);
  }

  @OpenAPI({
    description: "Query temporary url from s3 that return user vcard.",
    security: [{ bearerAuth: [] }], // Applied to each method
  })
  @ResponseSchema(ResponseModel, {
    contentType: "application/json",
    description: "Response ",
    statusCode: "200"
  })
  @HttpCode(HttpStatusCode.OK)
  @Get("/users/:id/vcard")
  @UseBefore(CheckJwtMiddleware)
  async getVcardTemporaryUrl(@Param("id") id: string): Promise<ResponseModel | ApiError> {
    try {
      const vcardUrl = await this._assetService.getVcardTemporaryUrl(id);
      return new ResponseModel(HttpStatusCode.OK, `Temporary vcard url for user: ${id}`, vcardUrl.toString());
    } catch (error) {
      throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
    }
  }

  private async uploadVcard(statelessUser: StatelessUser, userId?: string): Promise<void> {
    this._organisationService.getName()
      .then(async organisationName => {
        let userJob = null;
        if (statelessUser.jobId) {
          userJob = await this._organisationService.getJob(statelessUser.jobId);
        }
        const vcard = new VcardApiModel(statelessUser, organisationName, userJob);
        this._assetService.uploadVcard(statelessUser.id || userId, vcard.serializeAsBuffer());
      }).catch(error => {
        console.log(error);
        throw new ApiError(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          ReturnCodes.SERVER_ERROR,
          `User was sucessfully updated but vcard creation has failed:
          ${error}`
        );
      });
  }
}
