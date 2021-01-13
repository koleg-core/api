// Forked from:
//   https://github.com/stemmlerjs/white-label/blob/503ee491192a3eff026704f4de9a7477daebb630/src/core/logic/AppError.ts
import { Result } from "./result";
import { UseCaseError } from "./use-case-error";

export namespace GenericAppError {
  export class UnexpectedError extends Result<UseCaseError> {
    public constructor (err: any) {
      super(false, {
        message: "An unexpected error occurred.",
        error: err
      } as UseCaseError);
      console.log("[AppError]: An unexpected error occurred");
      console.error(err);
    }

    public static create (err: any): UnexpectedError {
      return new UnexpectedError(err);
    }
  }
}
