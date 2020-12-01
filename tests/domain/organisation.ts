import {Organisation} from '../../src/domain/Organisation';

export const genOrganisation = () => {
    return new Organisation("Test Corp", "Test Corp description.");
}