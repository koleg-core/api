import { v4 as uuid } from "uuid";

import { ReturnCodes } from "../enums/return-codes.enum";

import { ReadableGroup } from "./readableGroup";

export class Group {
  constructor(
      private id: string,
      private name: string,
      private description: string = null,
      private parentGroup: string = null,
      private childrenGroups: string[] = [],
      private imgUrl: URL = null,
      private creationDate: Date = null,
      private updateDate: Date = null
  ) {
    if(!this.id) {
      this.id = uuid();
    }
    this.creationDate = creationDate ? creationDate : new Date();
  }

  private update(){
    //TO DO : better implementation with database
    this.updateDate = new Date();
  }

  public setParentId(parentId: string){
    this.parentGroup = parentId;
    this.update();
  }

  public addChild(child: string){
    this.childrenGroups.push(child);
    this.update();
  }

  public getId(): string {
    return this.id;
  }

  public getCreationDate(): Date {
    return this.creationDate;
  }

  public getUpdateDate(): Date {
    return this.updateDate;
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

  public getChildrenGroupsId(): string[] {
    return this.childrenGroups;
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
    this.update();
    return ReturnCodes.UPDATED;
  }

  public hasChilds(): boolean {
    if(this.childrenGroups.length === 0) {
      return false;
    }
    return true;
  }

  public deleteChildren(childrenId: string) {
    if(Array.isArray(this.childrenGroups) && this.childrenGroups.length > 0){
      const index = this.childrenGroups.indexOf(childrenId);
      if(index > -1){
        this.childrenGroups.splice(index,-1);
        this.update();
      }
    }
  }

  public getReadableGroup(): ReadableGroup {
    return new ReadableGroup(
      this.id,
      this.name,
      this.description,
      this.parentGroup,
      this.childrenGroups,
      this.imgUrl
    );
  }
}
