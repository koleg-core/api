import {Job} from '../../src/domain/user/Job';

export const genJob = function():Job {
    return new Job("Tester job");
}