// Forked from:
//   https://github.com/stemmlerjs/white-label/blob/503ee491192a3eff026704f4de9a7477daebb630/src/core/logic/UseCaseError.ts
interface IInvalidUseCaseError {
  message: string;
  id: number;
}

export abstract class UseCaseError implements IInvalidUseCaseError {
  public readonly message: string;
  public readonly id: number;

  constructor (message: string, id: number) {
    this.message = message;
    this.id = id;
  }
}
