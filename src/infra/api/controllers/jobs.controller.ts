import Fuse from "fuse.js";

import { ReturnCodes } from "../../../domain/enums/return-codes.enum";
import { Job } from "../../../domain/user/Job";
import { QueryParam, Body, Delete, Get, HttpCode, JsonController, Param, Post, UseBefore } from "routing-controllers";
import { Inject, Service } from "typedi";
import { ApiError } from "../errors/api-error";
import { ResponseModel } from "../models/response.model";
import HttpStatusCode from "../models/http-status-code.enum";
import { JobApiModel } from "../models/job-api.model";
import { OrganisationService } from "../../../app/organisation.service";
import { AuthService } from "../auth/auth.service";

@Service("job.controller")
@JsonController()
export class JobsController {

  @Inject("organisation.service")
  private readonly _organisationService: OrganisationService;
  private readonly _fuseOptions: Fuse.IFuseOptions<Job> = {
    includeScore: false,
    keys: ["name"] // This break private things, but don't care
  }

  @Get("/jobs")
  @UseBefore(AuthService.checkJwt)
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
          const realItemsNumber = itemsNumber || 20;
          if (realPage * realItemsNumber <= jobsResponse.length) {
            jobsResponse = jobsResponse.slice((realPage - 1) * realItemsNumber, realPage * realItemsNumber);
          } else {
            jobsResponse = jobsResponse.slice((realPage - 1) * realItemsNumber, jobsResponse.length);
          }
        }
        return new ResponseModel(HttpStatusCode.OK, "Success", jobsResponse);
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @Post("/jobs")
  @UseBefore(AuthService.checkJwt)
  async post(@Body() job: JobApiModel): Promise<ResponseModel | ApiError> {
    return this._organisationService.createJob(job.toJob())
      .then(returnCode => {
        if (returnCode === ReturnCodes.CONFLICTING) {
          throw new ApiError(HttpStatusCode.CONFLICT, ReturnCodes.CONFLICTING, "Job with this name already exist");
        }
        return new ResponseModel(returnCode, `Request returns with status : ${returnCode}.`);
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @HttpCode(HttpStatusCode.OK)
  @Get("/jobs/:name")
  @UseBefore(AuthService.checkJwt)
  async get(@Param("name") name: string): Promise<ResponseModel | ApiError> {
    return this._organisationService.getJob(name)
      .then(job => {
        if (!job) {
          throw new ApiError(HttpStatusCode.NOT_FOUND, ReturnCodes.NOT_FOUND, `There is not job with name: ${job.getName()}`);
        }
        return new ResponseModel(HttpStatusCode.OK, "Success", JobApiModel.toJobModel(job));
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }

  @HttpCode(HttpStatusCode.OK)
  @Delete("/jobs/:name")
  @UseBefore(AuthService.checkJwt)
  async delete(@Param("name") name: string): Promise<ResponseModel | ApiError> {
    return this._organisationService.deleteJob(name)
      .then(returnCode => {
        if (returnCode === ReturnCodes.NOT_FOUND) {
          throw new ApiError(HttpStatusCode.NOT_FOUND, ReturnCodes.NOT_FOUND, "Job not found");
        }
        return new ResponseModel(returnCode, `Request returns with status : ${returnCode}.`);
      })
      .catch(error => {
        throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, ReturnCodes.SERVER_ERROR, error?.message);
      });
  }
}
