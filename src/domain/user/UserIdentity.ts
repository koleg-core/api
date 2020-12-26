import { default as slugify } from "slugify";

export class UserIdentity {

    private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly username: string = null,
        public readonly email: string = null
    ) {
      if (!this.firstName) {
        throw new Error("Invalid argument firstname: string");
      }

      if (!this.lastName) {
        throw new Error("Invalid argument lastname: string");
      }

      if (!username) {
        this.username = this._getUsername(this.getFullName());
      } else {
        if (username !== this._getUsername(username)) {
          this.username = username;
          throw new Error("Invalid argument username: don't respect this.usernameConstraint()");
        }
      }

      if (email && !this._isEmailValid(email)) {
        throw new Error("Invalid argument email format: string");
      }
    }

    public getFullName(): string {
      return `${this.firstName} ${this.lastName}`;
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

    private _getUsername(dirtyUsername: string): string {
      if (!dirtyUsername) {
        throw new Error("Invalid argument dirtyUsername: string");
      }

      return slugify(
        dirtyUsername,
        {
          replacement: ".", // replace spaces with replacement character, defaults to `-`
          lower: true,      // convert to lower case, defaults to `false`
          strict: false,    // strip special characters except replacement, defaults to `false`
        }
      );
    }

    private _isEmailValid(email: string) { // Maybe should we export this to a Validator class ?
      return this.EMAIL_REGEX.test(email);
    }
}
