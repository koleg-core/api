import { Organisation } from "../domain/Organisation";
import { OrganisationRepository } from "../domain/repos/organisation.repository";

export class OrganisationService {

  private _organisation: Organisation;

  constructor(
    private repository: OrganisationRepository
  ) {

  }

  public getJobs() {
  }

  public getJob() {

  }

  public create() {
    
  }

  public deleteJob() {

  }
}