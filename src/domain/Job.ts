
// while this class don't have any methods,
// It's will be useless
export class Job {

    constructor(
        readonly name: string
    ) {
        if (!this.name) {
            throw new Error('Invalid argument name: string');
        }
    }
}