import { ReturnCodes } from "../../../domain/enums/return-codes.enum";
import { Body, Delete, Get, HttpCode, JsonController, Param, Post } from "routing-controllers";
import { Inject, Service } from "typedi";
import { ApiError } from "../errors/api-error";
import { ResponseModel } from "../models/response.model";
import HttpStatusCode from "../models/http-status-code.enum";
import { JobApiModel } from "../models/job-api.model";
import { OrganisationService } from '../../../app/organisation.service';

@Service('job.controller')
@JsonController()
export class JobsController {

  @Inject('organisation.service')
  private _organisationService: OrganisationService;

  @Get('/jobs')
  async getAll(): Promise<ResponseModel | ApiError> {
    return this._organisationService.getJobs()
      .then(jobs => {
        const jobsResponse: JobApiModel[] = [];
        if (Array.isArray(jobs) && jobs.length > 0) {
          jobs.forEach(job => jobsResponse.push(JobApiModel.toJobModel(job)));
        }
        return new ResponseModel(HttpStatusCode.OK, 'Success', jobsResponse);
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      })
  }

  @Post('/jobs')
  async post(@Body() job: JobApiModel): Promise<ResponseModel | ApiError> {
    return this._organisationService.createJob(job.toJob())
      .then(returnCode => {
        if (returnCode === ReturnCodes.CONFLICTING) {
          throw new ApiError(HttpStatusCode.CONFLICT, ReturnCodes.CONFLICTING, `Job with this name already exist`);
        }
        return new ResponseModel(returnCode, `Request returns with status : ${returnCode}.`);
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      })
  }

  @HttpCode(HttpStatusCode.OK)
  @Get('/jobs/:name')
  async get(@Param('name') name: string): Promise<ResponseModel | ApiError> {
    return this._organisationService.getJob(name)
      .then(job => {
        if (!job) {
          throw new ApiError(HttpStatusCode.NOT_FOUND, ReturnCodes.NOT_FOUND, `There is not job with name: ${job.getName()}`);
        }
        return new ResponseModel(HttpStatusCode.OK, 'Success', JobApiModel.toJobModel(job));
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      })
  }

  @HttpCode(HttpStatusCode.OK)
  @Delete('/jobs/:name')
  async delete(@Param('name') name: string): Promise<ResponseModel | ApiError> {
    return this._organisationService.deleteJob(name)
      .then(returnCode => {
        if (returnCode === ReturnCodes.NOT_FOUND) {
          throw new ApiError(HttpStatusCode.NOT_FOUND, ReturnCodes.NOT_FOUND, "Job not found");
        }
        return new ResponseModel(returnCode, `Request returns with status : ${returnCode}.`);
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      })
  }
}