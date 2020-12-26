import { Organisation } from 'domain/organisation';

export const genGroupId = (
  organisation:Organisation,
  parentGroupId: string = null
): string => {
  const imgUrl:URL = new URL("https://live.staticflickr.com/2356/2343395980_e1274d24a1_b.jpg");
  if(parentGroupId){
    return organisation.addGroup(null, "Test group", "Test Group", parentGroupId, null, imgUrl);
  }
  return organisation.addGroup(null, "Test group", "Test Group", null);
}
