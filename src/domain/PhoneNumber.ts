
export class PhoneNumber {
    readonly label: string
    readonly value: string

    constructor(label: string, value: string) {
        if(label && label.length > 0) {
            this.label = label
        }
        if(this._isValidNumber(value)){
            this.value = value
        } else {
            throw new Error("Invalid arguement number: Don't respect constraint")
        }
    }

    private _isValidNumber(value: string) {
        return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(value)
    }
}