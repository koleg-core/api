import { Job } from "../../../domain/user/Job";
import { JobModel } from "../models/JobModel";

export class JobSerializer {

    static serializeJob(job: Job): JobModel{
        return new JobModel({name:job.getName()});
    }

    static deserializeJob(jobModel: JobModel): Job{
        return new Job(jobModel.name);
    }
}