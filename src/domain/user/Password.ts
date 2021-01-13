import {Guard} from "core/guard";
import {Result} from "core/result";

export class Password {

    private readonly DATE_LIMIT_MONTH = 4;

    constructor(
        private value: string,
        private dateLimit: Date = null
    ) {}

    public static factory(value: string, dateLimit: Date): Result<Password> {
      const valueGuardResult = Guard.againstNullOrUndefined(value, "value");
      if(!valueGuardResult.succeeded) {
        return Result.fail<Password>(valueGuardResult.message);
      }
      const dateLimitGuardResult = Guard.againstNullOrUndefined(dateLimit, "dateLimit");
      if(!dateLimitGuardResult.succeeded) {
        return Result.fail<Password>(dateLimitGuardResult.message);
      }
      const valueLengthGuardResult = Guard.againstZeroSize(value, "value");
      if(!valueLengthGuardResult.succeeded) {
        return Result.fail<Password>(valueLengthGuardResult.message);
      }
      return Result.ok<Password>(new Password(value, dateLimit));
    }

    public getValue(): string {
      return this.value;
    }

    public getDateLimit(): Date {
      return this.dateLimit;
    }

    public hasSameValue(password: Password): boolean {
      return this.value === password.getValue();
    }

    public isExpired(): boolean {
      return this.dateLimit <= new Date();
    }

    public isValueValid(valueToCheck: string): boolean {
      return !this.isExpired() && valueToCheck === this.value;
    }

    private initializeDateLimit(): void {
      const now = new Date();
      this.dateLimit = new Date(now.setMonth(now.getMonth() + this.DATE_LIMIT_MONTH));
    }
}
