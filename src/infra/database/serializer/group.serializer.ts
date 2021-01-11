import { SerializerRoot } from "./serializer-root";
import { Group } from "domain/group/Group";
import { GroupsModel } from "../models/GroupsModel";

export class GroupSerializer implements SerializerRoot<Group, GroupsModel> {

  public async serialize(group: Group): Promise<GroupsModel> {
    /*const groupExist = await GroupsModel.findOne({ where: { uuid: group.getId() } });
    const parentGroup = await GroupsModel.findOne({ where: { uuid: group.getParentId() } });
    const groupModel = new GroupsModel({uuid : group.getId(), name: group.getName(), description: group.getDescription(), imgUrl: group.getDescription()});
    groupModel.parentGroup = parentGroup;
    if(groupExist){
      groupModel.id = groupExist.id;
      groupModel.isNewRecord = false;
    }
    return groupModel;*/
    return null;
  }

  public async deserialize(groupModel: GroupsModel): Promise<Group> {
    console.log(groupModel.uuid);
    const parentGroupModel = await groupModel.getParentGroup();
    const childGroupModel = await groupModel.getGroups();
    let childGroupsId: string[] = [];
    if (Array.isArray(childGroupModel) && childGroupModel.length > 0) {
      for (let childGroup of childGroupModel) {
        if (childGroup) {
          console.log(childGroup);
          childGroupsId.push(childGroup.uuid);
        }
      }
    }
    //const parentGroup = new Group(parentGroupModel.uuid,parentGroupModel.name,parentGroupModel.description,null,[],new URL(parentGroupModel.imgUrl));
    return new Group(
      groupModel.uuid,
      groupModel.name,
      groupModel.description,
      parentGroupModel ? parentGroupModel.uuid : null,
      childGroupsId,
      new URL(groupModel.imgUrl));
  }
}