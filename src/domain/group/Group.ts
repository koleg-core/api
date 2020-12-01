import { v4 as uuid } from 'uuid';

import { ReturnCodes } from '../enums/return-codes.enum';

import { GroupProperties } from './GroupProperties';


export class Group {
    private _id: string;

    constructor(
      private _name: string,
      private _description: string = null,
      private _imgUrl: URL = null,
      private _parendGroup: Group = null,
      private _childsGroups: Group[] = [],
    ) {
        this._id = uuid();
        if(this._parendGroup){
            this._parendGroup._addChild(this);
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
        if(this._parendGroup) {
            return this._parendGroup.getId();
        }
        return null;
    }

    public getChildsId(): string[] {
        const childsId: string[] = [];
        this._childsGroups.forEach(
            childGroup => childsId.push(
                childGroup.getId()
            )
        );
        return childsId;
    }

    private _addChild(newChild: Group): ReturnCodes {
        if(!this._canOwnThisChild(newChild)) {
            return ReturnCodes.CONFLICTING;
        }

        this._childsGroups.push(newChild);
        return ReturnCodes.UPDATED;
    }

    public isRoot(): boolean {
        if(!this._parendGroup) {
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

    private _canShareSameParent(concurrent: Group): boolean {
        return this._name === concurrent.getName()
          || this._id === concurrent.getId();
    }

    private _canOwnThisChild(newChild: Group): boolean {
        const inPlaceConfictingChilds = this._childsGroups
          .filter(
              inPlaceChild => !inPlaceChild._canShareSameParent(newChild)
          );

        if(inPlaceConfictingChilds.length >= 0 ) {
          return false;
        }
        return true;
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