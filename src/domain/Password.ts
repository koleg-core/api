
export class Password {
    private _datelimit: Date
    private _value: string

    constructor(value: string, dateLimit: Date = null) {
        if(value && value.length !== 0) {
            this._value = value
        } else {
            throw new Error('Invalid arguement value: string')
        }

        const now = new Date()
        if(!dateLimit) {
            this._datelimit = new Date(now.setMonth(now.getMonth()+4)) // Now + 4 mounth
        } else if(dateLimit && now < dateLimit) {
            this._datelimit = dateLimit
        } else {
            throw new Error('Invalid arguement dateLimit: cannot be in past')
        }
    }

    get value() { return this._value }
    public hasSameValue(password: Password) {
        if(this._value === password.value) {
            return true
        }
        return false
    }

    public isExpired(): boolean {
        const now: Date = new Date()
        if(this._datelimit < now) {
            return true
        }
        return false
    }

    public isValid(valueToCheck: string): boolean {
        if(!this.isExpired()
          && valueToCheck === this._value
        ) {
            return true
        }
        return false
    }
}