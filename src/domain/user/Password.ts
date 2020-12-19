
export class Password {

    private readonly DATE_LIMIT_MONTH = 4;

    constructor(
        private _value: string,
        private _dateLimit: Date = null
    ) {
        if (!_value) {
            throw new Error('Invalid arguement value: string');
        }

        if (this._dateLimit) {
            if (this.isExpired()) {
                throw new Error('Invalid arguement dateLimit: cannot be in past');
            }
        } else {
            this._initializeDateLimit();
        }
    }

    public getValue(): string {
        return this._value;
    }

    public hasSameValue(password: Password): boolean {
        return this._value === password.getValue();
    }

    public isExpired(): boolean {
        return this._dateLimit <= new Date();
    }

    public isValueValid(valueToCheck: string): boolean {
        return !this.isExpired() && valueToCheck === this._value;
    }

    private _initializeDateLimit(): void {
        const now = new Date();
        this._dateLimit = new Date(now.setMonth(now.getMonth() + this.DATE_LIMIT_MONTH));
    }
}