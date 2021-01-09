import { RightAction } from "domain/enums/right-action.enum";
import { Group } from "domain/group/Group";
import { User } from "./User";

export class Right {

    constructor(
        private action: RightAction,
        private impactedSubject : User | Group
    ) {
    }

    public getImpactedSubject(): User|Group {
        return this.impactedSubject;
    }

    public getAction() : RightAction {
        return this.action;
    }
}