import Fuse from "fuse.js";

import {
  QueryParam,
  UploadedFile,
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  UseBefore,
  Put
} from "routing-controllers";
import {
  ResponseSchema,
  OpenAPI,
} from "routing-controllers-openapi";

import { ReturnCodes } from "domain/enums/return-codes.enum";
import { AssetsService } from "app/assets.service";

import { Inject, Service } from "typedi";
import { ApiError } from "../errors/api-error";
import { ResponseModel } from "../models/response.model";
import HttpStatusCode from "../models/http-status-code.enum";
import { OrganisationService } from "../../../app/organisation.service";
import { CheckJwtMiddleware } from "../auth/check-jwt-middleware";
import { Group } from "domain/group/Group";
import { GroupApiModel } from "../models/group-api.model";

@Service('group.controller')
@JsonController()
export class GroupsController {

  @Inject("pageSize.api.config")
  private _pageSize: number;

  @Inject("organisation.service")
  private readonly _organisationService: OrganisationService;
  private readonly _fuseOptions: Fuse.IFuseOptions<Group> = {
    includeScore: false,
    keys: ['name',
    "id",
    "description"] // This break private things, but don't care
  }

  @Inject("assets.service")
  private _assetService: AssetsService;

  @OpenAPI({
    description: "Query all groups using filter or not.",
    security: [{ bearerAuth: [] }], // Applied to each method
  })
  @ResponseSchema(GroupApiModel, {
    contentType: "application/json",
    description: "A list of groups",
    isArray: true,
    statusCode: "200"})
  @Get("/groups")
  @UseBefore(CheckJwtMiddleware)
  async getAll(
    @QueryParam("filter") filter?: string,
    @QueryParam("page") page?: number,
    @QueryParam("itemsNumber") itemsNumber?: number
  ): Promise<ResponseModel | ApiError> {
    return this._organisationService.getGroups()
      .then(groups => {
        console.log(groups);
        let groupsResponse: GroupApiModel[] = [];
        if (Array.isArray(groups) && groups.length > 0) {

          if (filter) {
            const fuse: Fuse<Group> = new Fuse(groups, this._fuseOptions);
            const fuzeGroups = fuse.search(filter);
            fuzeGroups.forEach(group => groupsResponse.push(GroupApiModel.toGroupModel(group.item)));
          } else {
            groups.forEach(group => groupsResponse.push(GroupApiModel.toGroupModel(group)));
          }

          const realPage = page || 1;
          const realItemsNumber = itemsNumber || this._pageSize;
          if (realPage * realItemsNumber <= groupsResponse.length) {
            groupsResponse = groupsResponse.slice((realPage - 1) * realItemsNumber, realPage * realItemsNumber);
          } else {
            groupsResponse = groupsResponse.slice((realPage - 1) * realItemsNumber, groupsResponse.length);
          }
        }
        return new ResponseModel(HttpStatusCode.OK, 'Success', groupsResponse);
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @OpenAPI({
    description: "Create new group.",
    security: [{ bearerAuth: [] }], // Applied to each method
  })
  @ResponseSchema(ResponseModel, {
    contentType: "application/json",
    description: "Response model with group id",
    statusCode: "200"})
  @Post("/groups")
  @UseBefore(CheckJwtMiddleware)
  async post(@Body() group: GroupApiModel): Promise<ResponseModel | ApiError> {
    return this._organisationService.createGroup(group.toGroup())
      .then(groupId => {
        if (!groupId) {
          throw new ApiError(HttpStatusCode.CONFLICT, ReturnCodes.CONFLICTING, 'Group with this name already exist');
        }
        return new ResponseModel(HttpStatusCode.OK, `Group created with id : ${groupId}.`);
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @OpenAPI({
    // description: "Delete jon using his id.",
    description: "Request group using his id.",
    security: [{ bearerAuth: [] }],
  })
  @ResponseSchema(ResponseModel, {
    contentType: "application/json",
    description: "Response of groupquery.",
    statusCode: "200"
  })
  @HttpCode(HttpStatusCode.OK)
  @Get('/groups/:id')
  @UseBefore(CheckJwtMiddleware)
  async get(@Param('id') groupId: string): Promise<ResponseModel | ApiError> {
    return this._organisationService.getGroup(groupId)
      .then(group => {
        if (!group) {
          throw new ApiError(HttpStatusCode.NOT_FOUND, ReturnCodes.NOT_FOUND, `There is not group with id: ${group.getId()}`);
        }
        return new ResponseModel(HttpStatusCode.OK, 'Success', GroupApiModel.toGroupModel(group));
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @OpenAPI({
    // description: "Delete jon using his id.",
    description: "update group using his id.",
    security: [{ bearerAuth: [] }],
  })
  @ResponseSchema(ResponseModel, {
    contentType: "application/json",
    description: "Response of delete groupquery.",
    statusCode: "200"
  })
  @HttpCode(HttpStatusCode.OK)
  @Put('/groups/:id')
  @UseBefore(CheckJwtMiddleware)
  async update(@Param('id') groupId: string, @Body() group: GroupApiModel): Promise<ResponseModel | ApiError> {
    const groupToUpdate = group.toGroup(groupId);
    return this._organisationService.updateGroup(groupToUpdate)
      .then(returnCode => {
        if (returnCode === ReturnCodes.CONFLICTING) {
          throw new ApiError(HttpStatusCode.CONFLICT, ReturnCodes.CONFLICTING, 'Group with this name already exist');
        } else if (returnCode === ReturnCodes.NOT_FOUND) {
          throw new ApiError(HttpStatusCode.CONFLICT, ReturnCodes.CONFLICTING, 'Group with this id not found');
        }
        return new ResponseModel(HttpStatusCode.OK, `Request returns with status : ${returnCode}.`);
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @HttpCode(HttpStatusCode.OK)
  @Get('/groups/:id/users/number')
  @UseBefore(CheckJwtMiddleware)
  async getUsersNumberByGroup(@Param('id') groupId: string): Promise<ResponseModel | ApiError> {
    return this._organisationService.getUsersNumberByGroup(groupId)
      .then(usersNumber => {
        return new ResponseModel(HttpStatusCode.OK, `Success`, usersNumber);
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @HttpCode(HttpStatusCode.OK)
  @Delete('/groups/:id')
  @UseBefore(CheckJwtMiddleware)
  async delete(@Param('id') groupsId: string): Promise<ResponseModel | ApiError> {
    return this._organisationService.deleteGroup(groupsId)
      .then(returnCode => {
        if (returnCode === ReturnCodes.NOT_FOUND) {
          throw new ApiError(HttpStatusCode.NOT_FOUND, ReturnCodes.NOT_FOUND, 'Group not found');
        }
        return new ResponseModel(returnCode, `Request returns with status : ${returnCode}.`);
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
  @Post("/groups/:id/upload_image")
  async uploadImage(@Param("id") id: string, @UploadedFile("profilePicture") profilePicture: Express.Multer.File): Promise<ResponseModel | ApiError> {
    if (profilePicture.size > 4000000) {
      throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, "File is too large. Limit is 4MB");
    }

    const newProfilePictureUrl: URL = this._assetService.uploadProfilePicture(id, profilePicture);
    this._organisationService.updateGroupProfilePictureUrl(id, newProfilePictureUrl)
      .then(returnCode => {
        if (returnCode < 0) {
          throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, returnCode, "Profile picture was not updated");
        }
      });
    return new ResponseModel(HttpStatusCode.ACCEPTED, "Group profile picture will be updated", newProfilePictureUrl.href);
  }
}
