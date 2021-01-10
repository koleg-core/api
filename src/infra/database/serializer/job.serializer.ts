import { Job } from "../../../domain/user/Job";
import { JobModel } from "../models/JobModel";
import { SerializerRoot } from "./serializer-root";

export class JobSerializer implements SerializerRoot<Job, JobModel> {

  public async serialize(job: Job): Promise<JobModel> {
    const jobExist = await JobModel.findOne({ where: { uuid: job.getId() } });
    const jobModel = new JobModel(
      {
        uuid: job.getId(),
        name: job.getName(),
        description: job.getDescription(),
        iconUrl: job.getIconUrl() ? job.getIconUrl().toString() : null
      }
    );

    if (jobExist) {
      jobModel.id = jobExist.id;
      jobModel.isNewRecord = false;
    }
    return jobModel;
  }

  public async deserialize(jobModel: JobModel): Promise<Job> {
    return new Job(
      jobModel.uuid,
      jobModel.name,
      jobModel.description,
      jobModel.iconUrl ? new URL(jobModel.iconUrl) : null
    );
  }
}