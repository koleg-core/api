import { v4 as uuid } from 'uuid';

import { ReturnCodes } from '../enums/return-codes.enum';

import { GroupProperties } from './GroupProperties';


export class Group {
    private _id: string;

    constructor(
      private _name: string,
      private _description: string = null,
      private _imgUrl: URL = null,
      private _parentGroup: Group = null,
      private _childsGroups: Group[] = [],
    ) {
        this._id = uuid();
        if(this._parentGroup){
            this._parentGroup.addChild(this);
        }
    }

    public getId(): string {
        return this._id;
    }

    public getName(): string {
        return this._name;
    }

    public getDescription(): string {
        return this._description;
    }

    public setDescription(description: string): ReturnCodes {
        if(!description) {
            throw new Error('Invalid argument description: string');
        }

        this._description = description;
        return ReturnCodes.UPDATED;
    }

    public getImgUrl(): URL {
        return this._imgUrl;
    }

    public updateImgUrl(imgUrl: URL): ReturnCodes {
        if(!imgUrl) {
          throw new Error('Invalid argument imgUrl: URL');
        }
        this._imgUrl = imgUrl;
        return ReturnCodes.UPDATED;
    }


    public getParentId(): string {
        if(this._parentGroup) {
            return this._parentGroup.getId();
        }
        return null;
    }

    public getChildsId(): string[] {
        return this._childsGroups
          .map(child => child.getId());
    }

    public isRoot(): boolean {
        if(!this._parentGroup) {
            return true;
        }
        return false;
    }

    public hasChilds(): boolean {
        if(this._childsGroups.length === 0) {
            return false;
        }
        return true;
    }

    // Here use static to replace missing friend of
    private static _canShareSameParent(
        inPlaceGroup: Group,
        concurrentGroup: Group): boolean {
        return inPlaceGroup._name === concurrentGroup.getName()
          || inPlaceGroup.getId() === concurrentGroup.getId();
    }

    public canShareSameParent(concurrentGroup: Group) {
        return Group._canShareSameParent(
            this,
            concurrentGroup);
    }

    // Here use static to replace missing friend of
    private static _canOwnThisChild(existingChild: Group, newChild: Group): boolean {
        const inPlaceConfictingChilds = existingChild._childsGroups
          .filter(
              inPlaceChild => !inPlaceChild.canShareSameParent(newChild)
          );

        if(inPlaceConfictingChilds.length >= 0 ) {
          return false;
        }
        return true;
    }

    public canOwnThisChild(newChild: Group): boolean {
        return Group._canOwnThisChild(
            this,
            newChild);
    }

    private static _addChild(parentGroup:Group , newChild: Group): ReturnCodes {
        if(!parentGroup.canOwnThisChild(newChild)) {
            return ReturnCodes.CONFLICTING;
        }

        parentGroup._childsGroups.push(newChild);
        return ReturnCodes.UPDATED;
    }

    public addChild(childGroup: Group) {
        Group._addChild(this, childGroup);
    }

    public getProperties(): GroupProperties {

        return new GroupProperties(
            this._id,
            this.getChildsId(),
            this._name, this._description,
            this._imgUrl,
            this.getParentId()
            )
    }
}