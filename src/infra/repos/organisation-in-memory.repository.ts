import { Service } from "typedi";
import { classToPlain } from "class-transformer";

import { OrganisationRepository } from "../../domain/repos/organisation.repository";
import { Organisation } from "../../domain/organisation";
import { Job } from "../../domain/user/Job";
import { StatelessUser } from "../../domain/user/StatelessUser";

@Service("organisation.repository")
class OrganisationInMemoryRepository implements OrganisationRepository {
  private _organisation: Organisation;

  constructor() {
    this._organisation = new Organisation("demo organisation", "this is a memory organisation");
  }
  save(organisation: Organisation): void {
    this._organisation = organisation;
  }
  read(): Organisation {
    return this._organisation;
  }

  async readAsync(): Promise<Organisation> {
    return this._organisation;
  }
  createJob(job: Job): void {
    console.log("job added");
  }
  deleteJob(name: string): void {
    console.log("job deleted");
  }
  createUser(user: StatelessUser): void {
    console.log("user created");
  }
  updateUser(user: StatelessUser): void {
    console.log("user updated");
  }
  updateUserPassword(userId: string, password: string): void {
    console.log("User password updated");
  }
  deleteUser(userId: string): void {
    console.log("user deleted");
  }
  createGroup(organisation: Organisation, groupId: string): void {
    console.log("group added");
  }
  updateGroup(organisation: Organisation, groupId: string): void {
    console.log("group updated");
  }
  deleteGroup(organisation: Organisation, groupId: string): void {
    console.log("group deleted");
  }
}

export const factory = OrganisationInMemoryRepository;
export const organisationInMemory = new OrganisationInMemoryRepository();
export default organisationInMemory;
