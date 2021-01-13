import {Guard, IGuardArgument} from "core/guard";
import {Result} from "core/result";
import { default as slugify } from "slugify";

export class UserIdentity {

  constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly username: string,
        public readonly email: string
  ){
    Object.freeze(this);
  }

  public static factory(
    firstName: string,
    lastName: string,
    username?: string,
    email?: string
  ): Result<UserIdentity> {

    const guardStringsParams: IGuardArgument[] = [
      {
        argument: firstName,
        argumentName: "firstName",
      },
      {
        argument: lastName,
        argumentName: "lastName",
      },
      {
        argument: email,
        argumentName: "email",
      }
    ];
    const nonNullparamGuardResult = Guard.againstNullOrUndefinedBulk(guardStringsParams);
    if(!nonNullparamGuardResult.succeeded) {
      return Result.fail<UserIdentity>(nonNullparamGuardResult.message);
    }

    const nonZeroLengthParamGuardResult = Guard.againstZeroSizeBulk(guardStringsParams);
    if(!nonZeroLengthParamGuardResult.succeeded) {
      return Result.fail<UserIdentity>(nonZeroLengthParamGuardResult.message);
    }

    const usernameGuardResult = Guard.againstAmbiguousNullUndefined(username, "username");
    if(!usernameGuardResult.succeeded) {
      return Result.fail<UserIdentity>(usernameGuardResult.message);
    }

    if (!username) {
      const fullNameResult = this._getFullName(firstName, lastName);
      if(fullNameResult.isFailure) {
        return Result.fail<UserIdentity>(fullNameResult.error);
      }
      const formatedUsernameResult = this._getFormatedUsername(fullNameResult.getValue());
      if(formatedUsernameResult.isFailure) {
        return Result.fail<UserIdentity>(formatedUsernameResult.getValue());
      }
      username = formatedUsernameResult.getValue();
    }

    const emailValidation = this._isEmailValid(email);
    if (emailValidation.isFailure) {
      return Result.fail<UserIdentity>(emailValidation.error);
    }
  }

  public getFullName(): string {
    const fullNameResult = UserIdentity._getFullName(this.firstName, this.lastName);
    return fullNameResult.getValue();
  }

  public control(declinedIdentity: string): boolean {
    return declinedIdentity === this.getFullName()
        || declinedIdentity === this.username
        || declinedIdentity === this.email;
  }

  public controlWithIdentity(declinedIdentity: UserIdentity): boolean {
    return this.control(declinedIdentity.email)
        || this.control(declinedIdentity.username);
  }

  private static _getFullName(firstName: string, lastName: string): Result<string> {
    const paramGuardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: firstName,
        argumentName: "firstName"
      }, {
        argument: lastName,
        argumentName: "lastName"
      }]);
    if(!paramGuardResult.succeeded) {
      return Result.fail<string>(paramGuardResult.message);
    }
    const fullName = `${firstName} ${lastName}`;
    return Result.ok<string>(fullName);
  }

  private static _getFormatedUsername(dirtyUsername: string): Result<string> {
    const dirtyUsernameGuardResult = Guard.againstNullOrUndefined(dirtyUsername, "dirtyUsername");
    if (!dirtyUsernameGuardResult) {
      return Result.fail<string>(dirtyUsernameGuardResult.message);
    }
    const dirtyUsernameSizeGuardResult = Guard.againstZeroSize(dirtyUsername, "dirtyUsername");
    if (!dirtyUsernameSizeGuardResult) {
      return Result.fail<string>(dirtyUsernameGuardResult.message);
    }

    const slugifiedUserName = slugify(
      dirtyUsername,
      {
        replacement: ".", // replace spaces with replacement character, defaults to `-`
        lower: true,      // convert to lower case, defaults to `false`
        strict: false,    // strip special characters except replacement, defaults to `false`
      }
    );
    return Result.ok<string>(slugifiedUserName);
  }

  private static _isEmailValid(email: string): Result<boolean> { // Maybe should we export this to a Validator class ?
    const guardResult = Guard.againstNullOrUndefined(email, "email");
    if (!guardResult.succeeded) {
      return Result.fail<boolean>(guardResult.message);
    }

    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Result.fail<boolean>("Email is not valid, email.");
    }
    return Result.ok<boolean>(true);
  }
}
