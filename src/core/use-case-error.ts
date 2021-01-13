// Forked from:
//   https://github.com/stemmlerjs/white-label/blob/503ee491192a3eff026704f4de9a7477daebb630/src/core/logic/UseCaseError.ts
interface IUseCaseErrorError {
  message: string;
}

export abstract class UseCaseError implements IUseCaseErrorError {
  public readonly message: string;

  constructor (message: string) {
    this.message = message;
  }
}
