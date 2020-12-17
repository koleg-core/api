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

import { ReturnCodes } from '../../../domain/enums/return-codes.enum';
import { Organisation } from "../../../domain/Organisation";
import { OrganisationRepository } from "../../../domain/OrganisationRepository";
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

  @Get("/users")
  getAll(): UserProperties[] {
    console.log(this._organisationRepository);

    const organisation: Organisation = this._organisationRepository.read();

    if (!organisation) {
      return undefined;
    }

    return organisation.getUsers();
  }

  @Post('/users')
  @HttpCode(201)
  @OnUndefined(500)
  post(@Body() user: UserWriteModel): ResponseModel {

    try {
      const organisation: Organisation = this._organisationRepository.read();
      const userIdentity: UserIdentity = new UserIdentity(
        user.firstName,
        user.lastName,
        user.username,
        user.email);

      const job: Job = new Job(user.job);
      const password: Password = new Password(user.passwordHash);
      const birthdayDate: Date = new Date(user.birthdate); // TODO implement dateLimit Password

      const phoneType: PhoneType = user.phone.type as PhoneType;
      const phoneNumber: PhoneNumber[] = [new PhoneNumber(phoneType, user.phone.value)];
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
          phoneNumber,
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

  // @Put('/users/:id')
  // put(@Param('id') id: number, @Body() user: any): {
  //   return 'Updating a user...';
  // }

  // @Delete('/users/:id')
  // remove(@Param('id') id: number): any {
  //   const organisation: Organisation = this._organisationRepository.read();
  // }
}