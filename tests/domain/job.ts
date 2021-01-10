import {Job} from "domain/user/Job";
import { Organisation } from "domain/organisation";

export const genJob = ():Job => {
  return new Job(null, "Tester job", "Test description", null);
};

export const genJobId = (organisation: Organisation): string => {

  return organisation.addJob(genJob());
};
