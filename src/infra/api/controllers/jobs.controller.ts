import { ReturnCodes } from "../../../domain/enums/return-codes.enum";
import { Organisation } from "../../../domain/Organisation";
import { OrganisationRepository } from "../../../domain/OrganisationRepository";
import { Body, Delete, Get, JsonController, Param, Post, Put } from "routing-controllers";
import { Inject, Service } from "typedi";
import { ApiError } from "../errors/api-error";
import { JobModel } from "../models/job.model";
import { ResponseModel } from "../models/response.model";
import HttpStatusCode from "../models/http-status-code.model";

@Service('job.controller')
@JsonController()
export class JobsController {

  @Inject('organisation.repository')
  private _organisationRepository: OrganisationRepository;


  @Get('/jobs')
  getAll() {
    try {
      const organisation: Organisation = this._organisationRepository.read();

      return new ResponseModel(HttpStatusCode.OK, 'Success', organisation.getJobs());
    } catch (error) {
      throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
    }

  }

  @Post('/jobs')
  post(@Body() job: JobModel) {
    try {
      const organisation: Organisation = this._organisationRepository.read();

      const returnCode: ReturnCodes = organisation.addJob(job.name);

      return new ResponseModel(returnCode, `Job ${job.name} was created.`);

    } catch (error) {
      throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
    }
  }

  @Get('/jobs/:name')
  get(@Param('name') name: string) {
    try {
      const organisation: Organisation = this._organisationRepository.read();

      const job = organisation.getJob(name);

      return new ResponseModel(HttpStatusCode.OK, 'Success', job);
    } catch (error) {
      throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
    }
  }

  @Delete('/jobs/:name')
  delete(@Param('name') name: string) {
    try {
      const organisation: Organisation = this._organisationRepository.read();

      const returnCode: ReturnCodes = organisation.deleteJob(name);

      return new ResponseModel(returnCode, `Job ${name} was deleted.`);

    } catch (error) {
      throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
    }
  }


}