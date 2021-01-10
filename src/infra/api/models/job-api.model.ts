import {
  IsDefined,
  IsOptional,
  IsString,
  IsUUID
} from "class-validator";
import { Job } from "domain/user/Job";

export class JobApiModel {

  @IsUUID()
  @IsOptional()
  public readonly id: string;

  @IsDefined()
  @IsString()
  public readonly name: string

  @IsString()
  @IsOptional()
  public readonly description: string;

  @IsString()
  @IsOptional()
  public readonly iconUrl: string;

  constructor(
    id: string,
    name: string,
    description: string,
    iconUrl: string
  ) {
    // IMPORTANT:
    // The class validator fill object after creation,
    // then this constructor is here to external manipulations.
    // For the same reason, we can't throw error into constructor
    // for missing properties.
    this.id = id;
    this.name = name;
    this.description = description;
    this.iconUrl = iconUrl;
  }

  public static toJobModel(job: Job): JobApiModel {
    return new JobApiModel(
      job.getId(),
      job.getName(),
      job.getDescription(),
      job.getIconUrl() ? job.getIconUrl().toString() : null
    );
  }

  public toJob(id: string = null): Job {
    if (this.id && id && id !== this.id) {
      throw new Error("Invalid argument parameter id can't be different than this.id.");
    }

    return new Job(
      this.id,
      this.name,
      this.description,
      this.iconUrl ? new URL(this.iconUrl) : null
    );
  }
}
