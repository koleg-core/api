import { Service, Inject } from 'typedi';
import {
  JsonController,
  HttpCode,
  OnUndefined,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Param
} from "routing-controllers";

import { hashSync } from 'bcrypt';

import { ReturnCodes } from '../../../domain/enums/return-codes.enum';
import { Organisation } from "../../../domain/organisation";
import { ReadableUser } from "../../../domain/user/ReadableUser";
import { UserIdentity } from '../../../domain/user/UserIdentity';
import { Job } from '../../../domain/user/Job';
import { Password } from '../../../domain/user/Password';
import { PhoneNumber } from '../../../domain/user/PhoneNumber';
import { PhoneType } from '../../../domain/enums/phone-type.enum';
import { ApiError } from '../errors/api-error'

import { UserWriteApiModel } from "../models/user-write-api.model";
import { ResponseModel } from "../models/response.model";
import { HttpStatusCode } from "../models/http-status-code.enum";
import { OrganisationService } from '../../../app/organisation.service';
// import { } from "../models/user-write.model";

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
    // return this._organisationService.getUsers()
    //   .then(UserPwdHistory => {
    //     const usersResponse = [];
    //     if (Array.isArray(users) && users.length > 0) {
    //       users.forEach(user => usersResponse.push(JobApiModel.toJobModel(job)));
    //     }
    //     return new ResponseModel(HttpStatusCode.OK, 'Success', jobsResponse);
    //   })
    //   .catch(error => {
    //     return new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
    //   })
  }

  @Post('/users')
  @HttpCode(HttpStatusCode.CREATED)
  post(@Body() user: UserWriteApiModel): ResponseModel {
    try {
      const organisation: Organisation = this._organisationRepository.read();
      const userIdentity: UserIdentity = new UserIdentity(
        user.firstName,
        user.lastName,
        user.username,
        user.email);

      const job: Job = new Job(user.job);

      const hash: string = hashSync(user.passwordHash, this._saltRoudsPassword);

      const password: Password = new Password(hash);
      const birthdayDate: Date = new Date(user.birthdate); // TODO implement dateLimit Password

      const phoneNumbers: PhoneNumber[] = [];
      user.phones.forEach(phone => {
        const phoneType: PhoneType = phone.type as PhoneType;
        phoneNumbers.push(new PhoneNumber(phoneType, phone.value))
      })
      const expirationDate = new Date(user.expirationDate) || null;

      // Return user uuid
        const userId: string = organisation.addUser(
          userIdentity,
          password,
          job,
          birthdayDate,
          user.groupIds,
          null,
          null,
          phoneNumbers,
          expirationDate
        )

        if (!userId) {
          throw new ApiError(HttpStatusCode.NOT_FOUND, ReturnCodes.NOT_FOUND, "User was not created");
        }
        this._organisationRepository.save(organisation);
        return new ResponseModel(ReturnCodes.CREATED, `User ${userId} was created.`);

    } catch (error) {
      throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error);
    }
    // Should not be reached
  }

  @Put('/users/:id')
  put(@Param('id') id: string, @Body() user: UserWriteApiModel): ResponseModel {
    const organisation: Organisation = this._organisationRepository.read();

    if(!organisation.containsUserById(id)) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, ReturnCodes.NOT_FOUND, `There is not user with id: ${id}`);
    }
    try {
      const userIdentity: UserIdentity = new UserIdentity(
        user.firstName,
        user.lastName,
        user.username,
        user.email);

      const job: Job = new Job(user.job);
      const birthdayDate: Date = new Date(user.birthdate);
      const phoneNumbers: PhoneNumber[] = [];
      user.phones.forEach(phone => {
        const phoneType: PhoneType = phone.type as PhoneType;
        phoneNumbers.push(new PhoneNumber(phoneType, phone.value))
      })

      let expirationDate: Date = null;
      if(user.expirationDate) {
        expirationDate =  new Date(user.expirationDate);
      }

     let profilePictureUrl: URL = null
     if(user.profilePictureUrl) {
      profilePictureUrl = new URL(user.profilePictureUrl);
     }

      const ReadableUser: ReadableUser = new ReadableUser(
        id,
        userIdentity,
        job,
        user.groupIds,
        profilePictureUrl,
        null,
        phoneNumbers,
        expirationDate,
        birthdayDate,
      );

      organisation.updateUser(id, ReadableUser);
      this._organisationRepository.save(organisation);
      return new ResponseModel(ReturnCodes.CREATED, `User ${id} was updated.`);

    } catch (error) {
      throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error);
    }
    // Should not be reached
  }

  @Delete('/users/:id')
  remove(@Param('id') id: string): any {
    const organisation: Organisation = this._organisationRepository.read();
    if(!organisation.containsUserById(id)) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, ReturnCodes.NOT_FOUND, `There is not user with id: ${id}`);
    }
    try {
      organisation.deleteUser(id)
      this._organisationRepository.save(organisation);
      return new ResponseModel(ReturnCodes.REMOVED, `User ${id} was removed.`);

    } catch (error) {
      throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error);
    }
    // Should not be reached
  }
}