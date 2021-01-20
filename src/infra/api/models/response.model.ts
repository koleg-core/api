import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class ResponseModel {

  @IsNumber()
  readonly status: number;

  @IsString()
  readonly message: string;

  @IsOptional()
  readonly response?: unknown;

  constructor(status: number, message: string, response?: unknown) {
    this.status = status;
    this.message = message;
    this.response = response;
    this.response = this.response || {};
  }
}