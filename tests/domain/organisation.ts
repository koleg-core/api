import {Organisation} from '../../src/domain/Organisation';

export const genOrganisation = ():Organisation => {
    return new Organisation("Test Corp", "Test Corp description.");
}