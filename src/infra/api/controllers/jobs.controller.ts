import { ReturnCodes } from "../../../domain/enums/return-codes.enum";
import { Organisation } from "../../../domain/Organisation";
import { OrganisationRepository } from "../../../domain/repos/organisation.repository";
import { Body, Delete, Get, HttpCode, JsonController, Param, Post, Put } from "routing-controllers";
import { Inject, Service } from "typedi";
import { ApiError } from "../errors/api-error";
import { ResponseModel } from "../models/response.model";
import HttpStatusCode from "../models/http-status-code.model";
import { JobApiModel } from "../models/job-api.model";

@Service('job.controller')
@JsonController()
export class JobsController {

  @Inject('organisation.repository')
  private _organisationRepository: OrganisationRepository;



  @Get('/jobs')
  async getAll() {

    const organisation: Organisation = await this._organisationRepository.readAsync();

    return organisation.getJobs();

    // return await this._organisationRepository.readJobs()
    //   .then(jobs => {
    //     return new ResponseModel(HttpStatusCode.OK, 'Success', jobs);
    //   })
    //   .catch(error => {
    //     return new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
    //   });
  }

  @Post('/jobs')
  post(@Body() job: JobApiModel) {

    return this._organisationRepository.readAsync()
      .then(organisation => {
        const returnCode: ReturnCodes = organisation.addJob(job.getName());
        this._organisationRepository.createJob(organisation);
        return new ResponseModel(returnCode, `Job ${job.getName()} was created.`);
      })
      .catch(error => {
        return new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      })
  }

  @HttpCode(HttpStatusCode.OK)
  @Get('/jobs/:name')
  get(@Param('name') name: string): ResponseModel {
    try {
      const organisation: Organisation = this._organisationRepository.read();

      const job = organisation.getJob(name);


      return new ResponseModel(HttpStatusCode.OK, 'Success', job);
    } catch (error) {
      throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
    }
  }

  @Delete('/jobs/:name')
  delete(@Param('name') name: string): ResponseModel {
    try {
      const organisation: Organisation = this._organisationRepository.read();

      const returnCode: ReturnCodes = organisation.deleteJob(name);

      return new ResponseModel(returnCode, `Job ${name} was deleted.`);

    } catch (error) {
      throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
    }
  }
}