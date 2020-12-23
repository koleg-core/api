import {Job} from 'domain/user/Job';

export const genJob = ():Job => {
    return new Job("Tester job");
}
