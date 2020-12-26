import { Organisation } from 'domain/organisation';

export const genOrganisation = ():Organisation => {
  return new Organisation("Test Corp", "Test Corp description.");
}
