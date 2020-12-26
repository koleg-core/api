export class ReadableGroup {

  constructor(
      public readonly id: string,
      public readonly name: string,
      public readonly description: string,
      public readonly parentGroupId: string,
      public readonly childGroupsId: string[],
      public readonly imgUrl: URL
  ) {}
}
