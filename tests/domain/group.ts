
import { Organisation } from '../../src/domain/Organisation';

export const genGroupId = function(organisation:Organisation):string {
    const imgUrl:URL = new URL("https://live.staticflickr.com/2356/2343395980_e1274d24a1_b.jpg");
    return organisation.addGroup("Test group", "Test Group", imgUrl);
}