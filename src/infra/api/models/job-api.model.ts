import { Job } from "../../../domain/user/Job";

export class JobApiModel {

  constructor(
    private name: string
  ) {
    // super(name);
  }

  getName() {
    return this.name;
  }
}