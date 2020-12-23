import {Job} from '../../src/domain/user/Job';

export const genJob = ():Job => {
    return new Job("Tester job");
}