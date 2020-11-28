
export class Role {

    constructor(private _userId: string) {
        if (!this._userId) {
            throw new Error('Invalid argument userId: string');
        }
    }
}