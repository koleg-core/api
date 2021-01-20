import { Job } from "domain/user/Job";
import { Organisation } from "domain/organisation";

export const genJob = (): Job => {
  return new Job(null, "Tester job", "Test description", null);
};

export const genJobId = (organisation: Organisation): string => {

  const res = organisation.addJob(genJob());

  if (res.id && !res.error) {
    return res.id;
  }
  return null;
};
