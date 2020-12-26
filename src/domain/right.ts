import { User } from "./user/User";
import { Group } from "./group/Group";

export class Right {

  constructor(
    private _thing: User|Group
  ){
  }

  public getSubjet(): User|Group {
    return this._thing;
  }
}
