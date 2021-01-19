import { SerializerRoot } from "./serializer-root";
import { Group } from "domain/group/Group";
import { GroupsModel } from "../models/GroupsModel";

export class GroupSerializer implements SerializerRoot<Group, GroupsModel> {

  public async serialize(group: Group): Promise<GroupsModel> {
    const groupModel = new GroupsModel({
      uuid : group.getId(),
      name: group.getName(),
      description: group.getDescription(),
      creationDate: group.getCreationDate(),
      updateDate: group.getUpdateDate(),
      imgUrl: group.getImgUrl() ? group.getImgUrl().toString() : null});

    const groupExist = await GroupsModel.findOne({ where: { uuid: group.getId() } });
    if(groupExist){
      groupModel.id = groupExist.id;
      groupModel.isNewRecord = false;
    }
    const parentGroup = await GroupsModel.findOne({ where: { uuid: group.getParentId() } });
    if(parentGroup){
      groupModel.parentGroup = parentGroup;
    }
    const childrenGroupsIds = group.getChildrenGroupsId();
    let childrenGroupsModel: GroupsModel[] = [];
    if(Array.isArray(childrenGroupsIds) && childrenGroupsIds.length > 0){
      for await (let childrenGroupId of childrenGroupsIds){
        const childrenGroup = await GroupsModel.findOne({ where: { uuid: childrenGroupId } });
        if(childrenGroup){
          childrenGroupsModel.push(childrenGroup);
        }
      }
    }
    if(Array.isArray(childrenGroupsModel) && childrenGroupsModel.length > 0){
      groupModel.childrenGroups = childrenGroupsModel;
    }
    return groupModel;
  }

  public async deserialize(groupModel: GroupsModel): Promise<Group> {
    const parentGroupModel = await groupModel.getParentGroup();
    const childrenGroupsModel = await groupModel.getGroups();
    let childrenGroupsId: string[] = [];
    if (Array.isArray(childrenGroupsModel) && childrenGroupsModel.length > 0) {
      for (let childrenGroup of childrenGroupsModel) {
        if (childrenGroup) {
          childrenGroupsId.push(childrenGroup.uuid);
        }
      }
    }
    return new Group(
      groupModel.uuid,
      groupModel.name,
      groupModel.description,
      parentGroupModel ? parentGroupModel.uuid : null,
      childrenGroupsId,
      groupModel.imgUrl ? new URL(groupModel.imgUrl) : null,
      groupModel.creationDate ? new Date(groupModel.creationDate) : null,
      groupModel.updateDate ? new Date(groupModel.updateDate) : null 
      );
  }
}