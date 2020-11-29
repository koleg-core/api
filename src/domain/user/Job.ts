
// while this class don't have any methods,
// It's will be useless
export class Job {

    constructor(
        private name: string
    ) {
        if (!this.name) {
            throw new Error('Invalid argument name: string');
        }
    }

    public getName(): string {
        return this.name;
    }
}