import '../../src/app/app';
import { App } from '../../src/app/app';
import { Organisation } from '../../src/domain/Organisation';
import { Api } from '../../src/infra/api/api';
import { OrganisationInMemory } from '../../src/infra/OrganisationInMemory';

import { genOrganisation } from '../domain/organisation';

// THIS TEST IS NOT WORKING
describe('Organisation', () => {
    describe('#init()', () => {
      it('should be created without error', (done) => {
        try {
            const repository: OrganisationInMemory = new OrganisationInMemory();
            const organisation: Organisation =  genOrganisation();
            repository.save(organisation);

            const apiService: Api = new Api(repository);
            const application: App = new App(apiService);
            application.start()

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