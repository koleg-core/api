
import { Organisation } from '../../src/domain/Organisation';

export const genGroupId = function(
    organisation:Organisation,
    parentGroupId: string = null
): string {
    const imgUrl:URL = new URL("https://live.staticflickr.com/2356/2343395980_e1274d24a1_b.jpg");
    if(parentGroupId){
        return organisation.addGroup("Test group", "Test Group", imgUrl, parentGroupId);
    }
    return organisation.addGroup("Test group", "Test Group", imgUrl);
}