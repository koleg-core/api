import { Organisation } from "domain/organisation";
import { Group } from "domain/group/Group"

export const genGroup = ():Group => {
  const imgUrl:URL = new URL("https://live.staticflickr.com/2356/2343395980_e1274d24a1_b.jpg");
  return new Group(null,'test','salut',null,[],imgUrl);
};

export const genGroupId = (organisation: Organisation): string => {

  return organisation.addGroup(genGroup());
};
