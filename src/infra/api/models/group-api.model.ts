import {
    IsDefined,
    IsOptional,
    IsString,
    IsUUID
  } from "class-validator";
  import { Group } from "domain/group/Group";
  
  export class GroupApiModel {
  
    @IsUUID()
    @IsOptional()
    public readonly id: string;
  
    @IsDefined()
    @IsString()
    public readonly name: string
  
    @IsString()
    @IsOptional()
    public readonly description: string;

    @IsString()
    @IsOptional()
    public readonly parentGroupId: string;

    @IsOptional()
    public readonly childGroupsId: string[];

    @IsOptional()
    public readonly imgUrl: string;
  
    constructor(
      id: string,
      name: string,
      description: string,
      parentGroupId: string,
      childGroupsId: string[],
      imgUrl: string
    ) {
      // IMPORTANT:
      // The class validator fill object after creation,
      // then this constructor is here to external manipulations.
      // For the same reason, we can't throw error into constructor
      // for missing properties.
      this.id = id;
      this.name = name;
      this.description = description;
      this.parentGroupId = parentGroupId;
      this.childGroupsId = childGroupsId;
      this.imgUrl = imgUrl;
    }
  
    public static toGroupModel(group: Group): GroupApiModel {
      return new GroupApiModel(
        group.getId(),
        group.getName(),
        group.getDescription(),
        group.getParentId(),
        group.getChildGroupsId(),
        group.getImgUrl() ? group.getImgUrl().toString() : null
      );
    }
  
    public toGroup(id: string = null): Group {
      if (id && !this.id){
        throw new Error("Invalid argument parameter id.");
      }
      if (this.id && id && id !== this.id) {
        throw new Error("Invalid argument parameter id can't be different than this.id.");
      }
  
      return new Group(
        id,
        this.name,
        this.description,
        this.parentGroupId,
        this.childGroupsId,
        this.imgUrl ? new URL(this.imgUrl) : null
      );
    }
  }
  