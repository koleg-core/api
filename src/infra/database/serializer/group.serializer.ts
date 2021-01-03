import { SerializerRoot } from "./serializer-root";
import { Group } from "domain/group/Group";
import { GroupsModel } from "../models/GroupsModel";

export class GroupSerializer implements SerializerRoot<Group, GroupsModel> {

  public async serialize(group: Group): Promise<GroupsModel> {
    const groupExist = await GroupsModel.findOne({ where: { uuid: group.getId() } });
    const parentGroup = await GroupsModel.findOne({ where: { uuid: group.getParentId() } });
    const groupModel = new GroupsModel({uuid : group.getId(), name: group.getName(), description: group.getDescription(), imgUrl: group.getDescription()});
    groupModel.parentGroup = parentGroup;
    if(groupExist){
      groupModel.id = groupExist.id;
      groupModel.isNewRecord = false;
    }
    return groupModel;
  }

  public async deserialize(groupModel: GroupsModel): Promise<Group> {
    const parentGroupModel = await groupModel.getParentGroup();
    const parentGroup = new Group(parentGroupModel.uuid,parentGroupModel.name,parentGroupModel.description,null,[],new URL(parentGroupModel.imgUrl));
    return new Group(groupModel.uuid,groupModel.name,groupModel.description,parentGroup,[],new URL(groupModel.imgUrl));
  }
}