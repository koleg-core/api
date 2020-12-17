import { HttpError } from "routing-controllers";
import { ResponseModel } from "../models/response.model";

export class ApiError extends HttpError {

  constructor(
    private readonly httpError: number,
    private readonly status: number,
    public readonly message: string,
    private readonly response: any = {}) {
    super(httpError, message);
  }

  public toJSON(): ResponseModel {
    return {
      status: this.status,
      message: this.message
    };
  }
}