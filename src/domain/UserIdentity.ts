import { default as slugify } from 'slugify'

export class UserIdentity {
    readonly _firstname: string
    readonly _lastname: string
    readonly _username: string
    readonly _email: string

    constructor(
        firstname: string,
        lastname: string,
        username: string = null,
        email: string = null
    ) {
        if(firstname && firstname.length > 0) {
            this._lastname = lastname
        } else {
            throw new Error('Invalid arguement firstname: string')
        }
        if(lastname && lastname.length > 0) {
            this._lastname = lastname
        } else {
            throw new Error('Invalid arguement lastname: string')
        }

        if(!username) {
            const fullName: string = this.fullName()
            this._username = this.usernameConstraint(fullName)
        } else {
            if (username === this.usernameConstraint(username) ) {
                this._username = username
            } else {
                throw new Error("Invalid arguement username: don't respect this.usernameConstraint()")
            }
        }
        if(email && this.respectEmailConstraint(email)) {
            this._email = email
        }
    }

    private usernameConstraint(dirtyUsername: string): string {
        if (dirtyUsername.length > 0) {
            const username: string = slugify(dirtyUsername, {
                replacement: '.',  // replace spaces with replacement character, defaults to `-`
                lower: true,      // convert to lower case, defaults to `false`
                strict: false,     // strip special characters except replacement, defaults to `false`
            })
            return username
        }
        throw new Error('Invalid arguement dirtyUsername: string')
    }
    private respectEmailConstraint(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    public fullName(): string {
        const fullname: string = this._firstname + ' ' + this._lastname
        return fullname
    }

    public control(declinedIdentity: string): boolean {
        if(declinedIdentity === this.fullName()) {
            return true
        } else if(declinedIdentity === this._username) {
         return true
        } else if( declinedIdentity === this._email) {
            return true
        }
        return false
    }
}