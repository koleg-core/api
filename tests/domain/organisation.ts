import {Organisation} from '../../src/domain/Organisation';

export const genOrganisation = function():Organisation {
    return new Organisation("Test Corp", "Test Corp description.");
}