import { v4 as uuid } from "uuid";

import { ReturnCodes } from "../enums/return-codes.enum";

import { ReadableGroup } from "./readableGroup";

export class Group {
  constructor(
      private id: string,
      private name: string,
      private description: string = null,
      private parentGroup: string = null,
      private childsGroups: string[] = [],
      private imgUrl: URL = null
  ) {
    if(!this.id) {
      this.id = uuid();
    }
  }

  public setParentId(parentId: string){
    this.parentGroup = parentId;
  }

  public addChild(child: string){
    this.childsGroups.push(child);
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getParentId(): string {
    return this.parentGroup;
  }

  public getChildGroupsId(): string[] {
    return this.childsGroups;
  }

  public setDescription(description: string): ReturnCodes {
    if(!description) {
      throw new Error("Invalid argument description: string");
    }

    this.description = description;
    return ReturnCodes.UPDATED;
  }

  public getImgUrl(): URL {
    return this.imgUrl;
  }

  public updateImgUrl(imgUrl: URL): ReturnCodes {
    if(!imgUrl) {
      throw new Error("Invalid argument imgUrl: URL");
    }
    this.imgUrl = imgUrl;
    return ReturnCodes.UPDATED;
  }

  public hasChilds(): boolean {
    if(this.childsGroups.length === 0) {
      return false;
    }
    return true;
  }

  public getReadableGroup(): ReadableGroup {
    return new ReadableGroup(
      this.id,
      this.name,
      this.description,
      this.parentGroup,
      this.childsGroups,
      this.imgUrl
    );
  }
}
