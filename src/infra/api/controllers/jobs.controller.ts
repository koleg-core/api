import Fuse from "fuse.js";

import {
  QueryParam,
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
import { Job } from "domain/user/Job";

import { Inject, Service } from "typedi";
import { ApiError } from "../errors/api-error";
import { ResponseModel } from "../models/response.model";
import HttpStatusCode from "../models/http-status-code.enum";
import { JobApiModel } from "../models/job-api.model";
import { OrganisationService } from "../../../app/organisation.service";
import { CheckJwtMiddleware } from "../auth/check-jwt-middleware";

@Service('job.controller')
@JsonController()
export class JobsController {

  @Inject("pageSize.api.config")
  private _pageSize: number;

  @Inject("organisation.service")
  private readonly _organisationService: OrganisationService;
  private readonly _fuseOptions: Fuse.IFuseOptions<Job> = {
    includeScore: false,
    keys: ['name'] // This break private things, but don't care
  }

  @OpenAPI({
    description: "Query all jobs using filter or not.",
    security: [{ bearerAuth: [] }], // Applied to each method
  })
  @ResponseSchema(JobApiModel, {
    contentType: "application/json",
    description: "A list of jobs",
    isArray: true,
    statusCode: "200"
  })
  @Get("/jobs")
  @UseBefore(CheckJwtMiddleware)
  async getAll(
    @QueryParam("filter") filter?: string,
    @QueryParam("page") page?: number,
    @QueryParam("itemsNumber") itemsNumber?: number
  ): Promise<ResponseModel | ApiError> {
    return this._organisationService.getJobs()
      .then(jobs => {

        let jobsResponse: JobApiModel[] = [];
        if (Array.isArray(jobs) && jobs.length > 0) {

          if (filter) {
            const fuse: Fuse<Job> = new Fuse(jobs, this._fuseOptions);
            const fuzeJobs = fuse.search(filter);
            fuzeJobs.forEach(job => jobsResponse.push(JobApiModel.toJobModel(job.item)));
          } else {
            jobs.forEach(job => jobsResponse.push(JobApiModel.toJobModel(job)));
          }
          const realPage = page || 1;
          const realItemsNumber = itemsNumber || this._pageSize;
          if (realPage * realItemsNumber <= jobsResponse.length) {
            jobsResponse = jobsResponse.slice((realPage - 1) * realItemsNumber, realPage * realItemsNumber);
          } else {
            jobsResponse = jobsResponse.slice((realPage - 1) * realItemsNumber, jobsResponse.length);
          }
        }
        return new ResponseModel(HttpStatusCode.OK, 'Success', jobsResponse);
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @OpenAPI({
    description: "Create new job.",
    security: [{ bearerAuth: [] }], // Applied to each method
  })
  @ResponseSchema(ResponseModel, {
    contentType: "application/json",
    description: "Response model with job id",
    statusCode: "200"
  })
  @Post("/jobs")
  @UseBefore(CheckJwtMiddleware)
  async post(@Body() job: JobApiModel): Promise<ResponseModel | ApiError> {
    return this._organisationService.createJob(job.toJob())
      .then(res => {
        if (!res.id && res.error) {
          throw new ApiError(HttpStatusCode.CONFLICT, res.error, 'Job with this name already exist');
        }
        return new ResponseModel(HttpStatusCode.OK, `Job created with id : ${res.id}.`, res.id);
      })
      .catch(error => {
        throw new ApiError(
          error.httpError ? error.httpError : HttpStatusCode.INTERNAL_SERVER_ERROR,
          error.status ? error.status : ReturnCodes.SERVER_ERROR,
          error?.message
        );
      });
  }

  @OpenAPI({
    // description: "Delete jon using his id.",
    description: "Request job using his id.",
    security: [{ bearerAuth: [] }],
  })
  @ResponseSchema(ResponseModel, {
    contentType: "application/json",
    description: "Response of job query.",
    statusCode: "200"
  })
  @HttpCode(HttpStatusCode.OK)
  @Get('/jobs/:id')
  @UseBefore(CheckJwtMiddleware)
  async get(@Param('id') jobId: string): Promise<ResponseModel | ApiError> {
    return this._organisationService.getJob(jobId)
      .then(job => {
        if (!job) {
          throw new ApiError(HttpStatusCode.NOT_FOUND, ReturnCodes.NOT_FOUND, `There is not job with name: ${job.getName()}`);
        }
        return new ResponseModel(HttpStatusCode.OK, 'Success', JobApiModel.toJobModel(job));
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @OpenAPI({
    // description: "Delete jon using his id.",
    description: "Delete job using his name.",
    security: [{ bearerAuth: [] }],
  })
  @ResponseSchema(ResponseModel, {
    contentType: "application/json",
    description: "Response of delete job query.",
    statusCode: "200"
  })
  @HttpCode(HttpStatusCode.OK)
  @Put('/jobs/:id')
  @UseBefore(CheckJwtMiddleware)
  async update(@Param('id') jobId: string, @Body() job: JobApiModel): Promise<ResponseModel | ApiError> {
    return this._organisationService.updateJob(job.toJob(jobId))
      .then(returnCode => {
        if (returnCode === ReturnCodes.CONFLICTING) {
          throw new ApiError(HttpStatusCode.CONFLICT, ReturnCodes.CONFLICTING, 'Job with this name already exist');
        } else if (returnCode === ReturnCodes.NOT_FOUND) {
          throw new ApiError(HttpStatusCode.CONFLICT, ReturnCodes.CONFLICTING, 'Job with this id not found');
        }
        return new ResponseModel(returnCode, `Request returns with status : ${returnCode}.`);
      })
      .catch(error => {
        throw new ApiError(
          error.httpError ? error.httpError : HttpStatusCode.INTERNAL_SERVER_ERROR,
          error.status ? error.status : ReturnCodes.SERVER_ERROR,
          error?.message
        );
      });
  }

  @HttpCode(HttpStatusCode.OK)
  @Delete('/jobs/:id')
  @UseBefore(CheckJwtMiddleware)
  async delete(@Param('id') jobId: string): Promise<ResponseModel | ApiError> {
    return this._organisationService.deleteJob(jobId)
      .then(returnCode => {
        if (returnCode === ReturnCodes.NOT_FOUND) {
          throw new ApiError(HttpStatusCode.NOT_FOUND, ReturnCodes.NOT_FOUND, 'Job not found');
        }
        return new ResponseModel(returnCode, `Request returns with status : ${returnCode}.`);
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @HttpCode(HttpStatusCode.OK)
  @Get('/jobs/:id/users/number')
  @UseBefore(CheckJwtMiddleware)
  async getUsersNumberByJob(@Param('id') jobId: string): Promise<ResponseModel | ApiError> {
    return this._organisationService.getUsersNumberByJob(jobId)
      .then(usersNumber => {
        return new ResponseModel(HttpStatusCode.OK, `Success`, usersNumber);
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }
}
