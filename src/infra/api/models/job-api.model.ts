import {
  IsDefined,
  IsString
} from "class-validator";
import { Job } from "domain/user/Job";

export class JobApiModel {

  @IsDefined()
  @IsString()
  public readonly name: string
  constructor(
    name: string
  ) {
    // IMPORTANT:
    // The class validator fill object after creation,
    // then this constructor is here to external manipulations.
    // For the same reason, we can't throw error into constructor
    // for missing properties.
    this.name = name;
  }

  public static toJobModel(job: Job): JobApiModel {
    return new JobApiModel(job.getName());
  }

  public toJob(): Job {
    return new Job(this.name);
  }
}
