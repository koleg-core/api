import { HttpError } from "routing-controllers";
import { ResponseModel } from "../models/response.model";

export class ApiError extends HttpError {

  constructor(
    readonly httpError: number,
    readonly status: number,
    readonly message: string,
    readonly response: any = {}) {
    super(httpError, message);
  }

  public toJSON(): ResponseModel {
    return {
      status: this.status,
      message: this.message
    };
  }
}