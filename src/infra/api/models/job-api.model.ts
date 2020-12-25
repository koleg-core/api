import { Job } from "../../../domain/user/Job";

export class JobApiModel {

  constructor(
    public readonly name: string
  ) {}

  public static toJobModel(job: Job): JobApiModel {
    return new JobApiModel(job.getName());
  }

  public toJob(): Job {
    return new Job(this.name);
  }
}
