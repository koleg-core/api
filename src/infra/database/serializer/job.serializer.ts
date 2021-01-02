import { Job } from "../../../domain/user/Job";
import { JobModel } from "../models/JobModel";
import { SerializerRoot } from "./serializer-root";

export class JobSerializer implements SerializerRoot<Job, JobModel> {

  public async serialize(job: Job): Promise<JobModel> {
    const jobExist = await JobModel.findOne({ where: { name: job.getName() } });
    const jobModel = new JobModel({ name: job.getName() });
    if(jobExist){
      jobModel.id = jobExist.id;
      jobModel.isNewRecord = false;
    }
    return jobModel;
  }

  public async deserialize(jobModel: JobModel): Promise<Job> {
    return new Job(jobModel.name);
  }
}