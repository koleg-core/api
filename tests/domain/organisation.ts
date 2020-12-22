import {Organisation} from '../../src/domain/organisation';

export const genOrganisation = ():Organisation => {
    return new Organisation("Test Corp", "Test Corp description.");
}
