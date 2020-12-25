import { SerializerRoot } from "./serializer-root";
import { Group } from "domain/group/Group";
import { GroupsModel } from "../models/GroupsModel";

export class GroupSerializer implements SerializerRoot<Group, GroupsModel> {

    public serialize(group: Group): GroupsModel {
        return new GroupsModel({uuid : group.getId(), name: group.getName(), description: group.getDescription(), imgUrl: group.getDescription()});
    }

    public async deserialize(groupModel: GroupsModel): Promise<Group> {
        return new Group(groupModel.uuid,groupModel.name,groupModel.description,null,null,new URL(groupModel.imgUrl));
    }
}