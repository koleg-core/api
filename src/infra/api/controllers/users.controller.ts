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
import { Organisation } from "../../../domain/Organisation";
import { OrganisationRepository } from "../../../domain/repos/organisation.repository";
import { UserProperties } from "../../../domain/user/UserProperties";
import { UserIdentity } from '../../../domain/user/UserIdentity';
import { Job } from '../../../domain/user/Job';
import { Password } from '../../../domain/user/Password';
import { PhoneNumber } from '../../../domain/user/PhoneNumber';
import { PhoneType } from '../../../domain/enums/phone-type.enum';
import { ApiError } from '../errors/api-error'

import { UserWriteModel } from "../models/user-write.model";
import { ResponseModel } from "../models/response.model";
import { HttpStatusCode } from "../models/http-status-code.model";
// import { } from "../models/user-write.model";

@Service('user.controller')
@JsonController()
export class UsersController {

  @Inject('organisation.repository')
  private _organisationRepository: OrganisationRepository;

  @Inject('saltRounds.security.config')
  private _saltRoudsPassword: number;

  @Get("/users")
  @HttpCode(HttpStatusCode.OK)
  @OnUndefined(HttpStatusCode.INTERNAL_SERVER_ERROR)
  getAll(): ResponseModel {
    try {
      const organisation: Organisation = this._organisationRepository.read();

      if (!organisation) {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.NOT_FOUND, "Organisation not found");
      }

      return new ResponseModel(
        HttpStatusCode.OK,
        'Success',
        organisation.getUsersProperties()
      );

    } catch (error) {
      throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error);
    }
  }

  @Post('/users')
  @HttpCode(HttpStatusCode.CREATED)
  @OnUndefined(HttpStatusCode.INTERNAL_SERVER_ERROR)
  post(@Body() user: UserWriteModel): ResponseModel {
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
  put(@Param('id') id: string, @Body() user: UserWriteModel): ResponseModel {
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

      const userProperties: UserProperties = new UserProperties(
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

      organisation.updateUser(id, userProperties);
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