import { Job } from "../../../domain/user/Job";
import { JobModel } from "../models/JobModel";
import { SerializerRoot } from "./serializer-root";

export class JobSerializer implements SerializerRoot<Job, JobModel> {

  public serialize(job: Job): JobModel {
    return new JobModel({ name: job.getName() });
  }

  public deserialize(jobModel: JobModel): Job {
    return new Job(jobModel.name);
  }
}