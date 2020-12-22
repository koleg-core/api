import { Organisation } from '../../src/domain/organisation';
import { UserIdentity } from '../../src/domain/user/UserIdentity';
import { Password } from '../../src/domain/user/Password';
import { StatelessUser } from '../../src/domain/user/StatelessUser';
import { SshKey } from '../../src/domain/user/SshKey';
import { Job } from '../../src/domain/user/Job';
import { PhoneNumber } from '../../src/domain/user/PhoneNumber';
// import { Group } from '../../src/domain/group/Group';

import { genStatelessUser } from './statelessUser';
import { genOrganisation } from './organisation';
import { genUserIdentity } from './userIdentity';
import { genPassword } from './password';
import { genPhoneNumber } from './phoneNumber';
import { genSshKey } from './sshKey';
import { genJob } from './job';
import { genGroupId } from './group';
import { genUserId } from './user';
// import { strict } from 'assert';

describe('Organisation', () => {
    describe('#init()', () => {
      it('should be created without error', (done) => {
        try {
            const organisation:Organisation = genOrganisation();
            if(!organisation) {
                const err = "There is not organisation created.";
                done(err);
            }
        } catch (err) {
            done(err);
        }
        done();
    });
    });
});

describe('Identity', () => {
    describe('#init()', () => {
      it('should be created without error', (done) => {
          const identity:UserIdentity = genUserIdentity();
          if(!identity) {
              const err = "User identity is undefined";
              done(err);
          }
        done();
    });
    });
});

describe('Password', () => {
    describe('#init()', () => {
      it('should be created without error', (done) => {
        try {
            const passwordWithExpiration:Password = genPassword();
        } catch (err) {
            done(err);
        }
        done();
    });
    });
});

describe('Job', () => {
    describe('#init()', () => {
      it('should be created without error', (done) => {
        try {
            const job:Job = genJob();
        } catch (err) {
            done(err);
        }
        done();
    });
    });
});

describe('Group', () => {
    describe('#init()', () => {
      it('should be created without error', (done) => {
        try {
            const organisation:Organisation = genOrganisation();
            const groupId:string = genGroupId(organisation);

            if(!organisation.getGroupPropertiesById(groupId)) {
                const err = "There is not group into organisation";
                done(err);
            }
        } catch (err) {
            done(err);
        }

        done();
      });
    });
});

describe('Group', () => {
    describe('#init() with parent', () => {
      it('should be created without error', (done) => {
        try {
            const organisation:Organisation = genOrganisation();
            const parentGroupId:string = genGroupId(organisation);
            const childGroupId:string = genGroupId(organisation, parentGroupId);

            if(
              !organisation.getGroupPropertiesById(parentGroupId)
              || !organisation.getGroupPropertiesById(childGroupId)
            ) {
                const err = "There is not group into organisation";
                done(err);
            }
        } catch (err) {
            done(err);
        }

        done();
      });
    });
});


describe('SshKey', () => {
    describe('#init()', () => {
      it('should be created without error', (done) => {
        try {
            const sshKey:SshKey = genSshKey();
        } catch (err) {
            done(err);
        }
        done();
    });
    });
});

describe('PhoneNumber', () => {
    describe('#init()', () => {
      it('should be created without error', (done) => {
        try {
            const phoneNumber: PhoneNumber = genPhoneNumber();
        } catch (err) {
            done(err)
        }
        done();
    });
    });
});

describe('StatelessUser', () => {
    describe('#init()', () => {
      it('should be created without error', (done) => {
          const organisation:Organisation = genOrganisation();

          const statelessUser: StatelessUser = genStatelessUser(organisation);
          if(!statelessUser) {
              const err = "statelessUser is undefined";
              done(err);
          }
        done();
    });
    });
});



describe('Organisation', () => {
  describe('#User()', () => {
    const organisation:Organisation = genOrganisation();
    let userId: string;
    it('user should be added without error', (done) => {
      try {
        userId = genUserId(organisation);
        if(!organisation.getReadableUserById(userId)) {
          const err = "There is no user into organisation.";
          done(err);
        }
      } catch (err) {
        done(err)
      }
      done();
    });
    it('user should be without error', (done) => {
      try {
        if(!organisation.getReadableUsers()) {
          const err = "There is no ReadableUser list";
          done(err);
        }
        if(!organisation.getReadableUserById(userId)) {
          const err = "There is no ReadableUser";
          done(err);
        }
      } catch (err) {
        done(err)
      }
      done();
    });
    it('user should be removed without error', (done) => {
      try {
        if(!organisation.deleteUser(userId)) {
          const err = "There is no ReturnCode";
          done(err);
        }
      } catch (err) {
        done(err)
      }
      done();
    });
  });
});
