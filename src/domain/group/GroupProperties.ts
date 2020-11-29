import { Group } from "./Group";

export class GroupProperties {

    constructor(
    readonly id: string,
    readonly groupsIds: string[],
    readonly name: string,
    readonly description: string,
    readonly imgUrl: URL,
    readonly parentGroupId: string
    ) {}
}