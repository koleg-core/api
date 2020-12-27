
export class Password {

    private readonly DATE_LIMIT_MONTH = 4;

    constructor(
        private value: string,
        private _dateLimit: Date = null
    ) {
      if (!value) {
        throw new Error("Invalid arguement value: string");
      }

      /*if (this._dateLimit) {
            if (this.isExpired()) {
                throw new Error('Invalid arguement dateLimit: cannot be in past');
            }
        } else {
            this._initializeDateLimit();
        }*/
    }

    public getValue(): string {
      return this.value;
    }

    public getDateLimit(): Date {
      return this._dateLimit;
    }

    public hasSameValue(password: Password): boolean {
      return this.value === password.getValue();
    }

    public isExpired(): boolean {
      return this._dateLimit <= new Date();
    }

    public isValueValid(valueToCheck: string): boolean {
      return !this.isExpired() && valueToCheck === this.value;
    }

    private initializeDateLimit(): void {
      const now = new Date();
      this._dateLimit = new Date(now.setMonth(now.getMonth() + this.DATE_LIMIT_MONTH));
    }
}
