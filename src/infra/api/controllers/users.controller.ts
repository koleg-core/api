import { Service, Inject } from "typedi";
import {
  JsonController,
  UploadedFile,
  HttpCode,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Param,
  BodyParam,
  UseBefore,
  CurrentUser
} from "routing-controllers";
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
import { AuthService } from "../auth/auth.service";
import { ReadableUser } from "domain/user/ReadableUser";

@Service("user.controller")
@JsonController()
export class UsersController {

  @Inject("saltRounds.security.config")
  private _saltRoudsPassword: number;

  @Inject("organisation.service")
  private _organisationService: OrganisationService;

  @Inject("assets.service")
  private _assetService: AssetsService;

  @Get("/users")
  @HttpCode(HttpStatusCode.OK)
  async getAll(): Promise<ResponseModel | ApiError> {
    return this._organisationService.getUsers()
      .then(users => {
        const usersResponse: ReadableUserApiModel[] = [];
        if (Array.isArray(users) && users.length > 0) {
          users.forEach(user => usersResponse.push(ReadableUserApiModel.toReadableUserApiModel(user)));
        }
        return new ResponseModel(HttpStatusCode.OK, "Success", usersResponse);
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @Post("/users")
  @HttpCode(HttpStatusCode.CREATED)
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

  @Get("/users/:id")
  async get(@Param("id") id: string): Promise<ResponseModel | ApiError> {
    return this._organisationService.getUserById(id)
      .then(user => {
        if (!user) {
          throw new ApiError(HttpStatusCode.NOT_FOUND, ReturnCodes.NOT_FOUND, `There is not user with id: ${user.getId()}`);
        }
        return new ResponseModel(HttpStatusCode.OK, "Success", ReadableUserApiModel.toReadableUserApiModel(user));
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error);
      });
  }

  @Put("/users/:id")
  @HttpCode(HttpStatusCode.OK)
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
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error);
      });
  }

  @Delete("/users/:id")
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

  @HttpCode(HttpStatusCode.ACCEPTED)
  @Put("/users/:id/update-password")
  async updatePassword(@Param("id") userId: string, @BodyParam('password') password: string): Promise<ResponseModel | ApiError> {

    if (!password) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, HttpStatusCode.BAD_REQUEST, 'The password must not be null or empty');
    }

    const readableUser = await this._organisationService.getUserById(userId);

    if (!readableUser) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, ReturnCodes.NOT_FOUND, 'User not found');
    }

    return hash(password, this._saltRoudsPassword)
      .then(async hashedPassword => {
        try {
          const returnCode = await this._organisationService.updateUserPassword(userId, hashedPassword);
          if (returnCode !== ReturnCodes.UPDATED) {
            throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, returnCode, 'User password cannot be changed.');
          }
          return new ResponseModel(HttpStatusCode.ACCEPTED, `Your password changment for user: ${userId} was aknoleged.`);
        } catch (error) {
          throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
        }
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @HttpCode(HttpStatusCode.ACCEPTED)
  @Post("/users/:id/upload_image")
  async uploadImage(@Param("id") id: string, @UploadedFile("profilePicture") profilePicture: Express.Multer.File): Promise<ResponseModel | ApiError> {
    const newProfilePictureUrl: URL = this._assetService.uploadProfilePicture(id, profilePicture);
    const statelessUser = new StatelessUser(id, null, null, null, null, null, null, null, null, null, null, newProfilePictureUrl);
    this._organisationService.updateUser(statelessUser)
      .then(returnCode => {
        if (returnCode < 0) {
          throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, returnCode, "Profile picture was not updated");
        }
      });
    return new ResponseModel(HttpStatusCode.ACCEPTED, "User profile picture will be updated", newProfilePictureUrl.href);
  }

  @HttpCode(HttpStatusCode.OK)
  @Get("/users/:id/vcard")
  async getVcardTemporaryUrl(@Param("id") id: string): Promise<ResponseModel | ApiError> {
    try {
      const vcardUrl = await this._assetService.getVcardTemporaryUrl(id);
      return new ResponseModel(HttpStatusCode.OK, `Temporary vcard url for user: ${id}`, vcardUrl.toString());
    } catch (error) {
      throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error);
    }
  }

  private async uploadVcard(statelessUser: StatelessUser, userId?: string): Promise<void> {
    this._organisationService.getName()
      .then(organisationName => {
        const vcard = new VcardApiModel(statelessUser, organisationName);
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
