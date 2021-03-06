import {
    IsDefined,
    IsOptional,
    IsString,
    IsDateString,
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
    public readonly childrenGroupsId: string[];

    @IsOptional()
    public readonly imgUrl: string;

    @IsDateString()
    @IsOptional()
    public readonly updateDate: string;

    @IsDateString()
    @IsOptional()
    public readonly creationDate: string;
  
    constructor(
      id: string,
      name: string,
      description: string,
      parentGroupId: string,
      childrenGroupsId: string[],
      imgUrl: string,
      creationDate: string,
      updateDate: string
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
      this.childrenGroupsId = childrenGroupsId;
      this.imgUrl = imgUrl;
      this.creationDate = creationDate;
      this.updateDate = updateDate;
    }
  
    public static toGroupModel(group: Group): GroupApiModel {
      return new GroupApiModel(
        group.getId(),
        group.getName(),
        group.getDescription(),
        group.getParentId(),
        group.getChildrenGroupsId(),
        group.getImgUrl() ? group.getImgUrl().toString() : null,
        group.getCreationDate() ? group.getCreationDate().toISOString() : null,
        group.getUpdateDate() ? group.getUpdateDate().toISOString() : null
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
        this.childrenGroupsId,
        this.imgUrl ? new URL(this.imgUrl) : null
      );
    }
  }
  