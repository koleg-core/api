import {UserIdentity} from 'domain/user/UserIdentity';

export const genUserIdentity = (): UserIdentity => {
  return new UserIdentity("john", "doe", "john.doe@test.com");
}
