import { Organisation } from 'domain/organisation';
import { StatelessUser } from 'domain/user/StatelessUser';
import { genStatelessUser } from './statelessUser';

export const genUserId = (organisation: Organisation): string => {

  const statelessUser: StatelessUser = genStatelessUser(organisation);

  return organisation.addUser(statelessUser);
}
