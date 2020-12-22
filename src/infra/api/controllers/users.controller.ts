import { Service, Inject } from 'typedi';
import {
  JsonController,
  HttpCode,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Param
} from "routing-controllers";

import { hash } from 'bcrypt';

import { ReturnCodes } from '../../../domain/enums/return-codes.enum';
import {Password} from '../../../domain/user/Password';
import {StatelessUser} from '../../../domain/user/StatelessUser';
import { ApiError } from '../errors/api-error'

import { WritableUserApiModel } from "../models/writable-user-api.model";
import { ResponseModel } from "../models/response.model";
import { HttpStatusCode } from "../models/http-status-code.enum";
import { OrganisationService } from '../../../app/organisation.service';
import { ReadableUserApiModel } from '../models/readable-user-api.model';

@Service('user.controller')
@JsonController()
export class UsersController {

  @Inject('saltRounds.security.config')
  private _saltRoudsPassword: number;

  @Inject('organisation.service')
  private _organisationService: OrganisationService;

  @Get("/users")
  @HttpCode(HttpStatusCode.OK)
  getAll(): Promise<ResponseModel | ApiError> {

    return this._organisationService.getUsers()
      .then(users => {
        const usersResponse: ReadableUserApiModel[] = [];
        if (Array.isArray(users) && users.length > 0) {
          users.forEach(user => usersResponse.push(ReadableUserApiModel.toReadableUserApiModel(user)));
        }
        return new ResponseModel(HttpStatusCode.OK, 'Success', usersResponse);
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @Post('/users')
  @HttpCode(HttpStatusCode.CREATED)
  post(@Body() user: WritableUserApiModel): Promise<ResponseModel | ApiError> {
    return this._organisationService.createUser(user.toStatelessUser())
      .then(id => {
        if (id) {
          return new ResponseModel(HttpStatusCode.OK, `User created with id: ${id}.`);
        } else {
          throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, 'User not created');
        }
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @Get('/users/:id')
  get(@Param('id') id: string): Promise<ResponseModel | ApiError> {
    return this._organisationService.getUserById(id)
      .then(user => {
        if (!user) {
          throw new ApiError(HttpStatusCode.NOT_FOUND, ReturnCodes.NOT_FOUND, `There is not user with id: ${user.getId()}`);
        }
        return new ResponseModel(HttpStatusCode.OK, 'Success', ReadableUserApiModel.toReadableUserApiModel(user));
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error);
      });
  }

  @Put('/users/:id')
  async put(@Param('id') id: string, @Body() user: WritableUserApiModel): Promise<ResponseModel | ApiError> {
    return this._organisationService.updateUser(user.toStatelessUser(id))
      .then(returnCode => {
        if (returnCode === ReturnCodes.NOT_FOUND) {
          throw new ApiError(HttpStatusCode.NOT_FOUND, ReturnCodes.NOT_FOUND, "User not found");
        }
        return new ResponseModel(returnCode, `Request returns with status : ${returnCode}.`);
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error);
      });
  }

  @Delete('/users/:id')
  remove(@Param('id') id: string): Promise<ResponseModel | ApiError> {

    return this._organisationService.deleteUser(id)
      .then(returnCode => {
        return new ResponseModel(returnCode, `Request returns with status : ${returnCode}.`);
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @Post('/users/:id/update-password')
  async updatePassword(@Param('id') id: string, @Body() frontHashedPassword: string): Promise<ResponseModel | ApiError> {
    return this._organisationService.getUserById(id)
      .then(readableUser => {
        hash(frontHashedPassword, this._saltRoudsPassword, (bcryptError: Error , backHashedPassword: string) => {
            if(bcryptError) {
                throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, bcryptError?.message);
            }
            const password: Password = new Password(backHashedPassword);
            const stateLessUser = new StatelessUser(
                readableUser.getId(),
                null,
                null,
                readableUser.getIdentity(),
                password,
                null,
            );
        })
          .catch (error => {
            throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
          });

        return new ResponseModel(HttpStatusCode.ACCEPTED, `Your password changment for user: ${id} was aknoleged.`);
    });
  }
}
