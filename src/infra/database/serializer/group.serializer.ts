import { SerializerRoot } from "./serializer-root";
import { Group } from "domain/group/Group";
import { GroupsModel } from "../models/GroupsModel";

export class GroupSerializer implements SerializerRoot<Group, GroupsModel> {

  public async serialize(group: Group): Promise<GroupsModel> {
    const groupModel = new GroupsModel({uuid : group.getId(), name: group.getName(), description: group.getDescription(), imgUrl: group.getImgUrl() ? group.getImgUrl().toString() : null});
    const groupExist = await GroupsModel.findOne({ where: { uuid: group.getId() } });
    if(groupExist){
      groupModel.id = groupExist.id;
      groupModel.isNewRecord = false;
    }
    const parentGroup = await GroupsModel.findOne({ where: { uuid: group.getParentId() } });
    if(parentGroup){
      groupModel.parentGroup = parentGroup;
    }
    const childGroupsIds = group.getChildGroupsId();
    let childGroupsModel: GroupsModel[] = [];
    if(Array.isArray(childGroupsIds) && childGroupsIds.length > 0){
      for await (let childGroupId of childGroupsIds){
        const childGroup = await GroupsModel.findOne({ where: { uuid: childGroupId } });
        if(childGroup){
          childGroupsModel.push(childGroup);
        }
      }
    }
    if(Array.isArray(childGroupsModel) && childGroupsModel.length > 0){
      groupModel.childGroups = childGroupsModel;
    }
    return groupModel;
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