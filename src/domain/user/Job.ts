import { type } from 'os';
import { default as slugify } from 'slugify';

// while this class don't have any methods,
// It's will be useless
export class Job {

    constructor(
        private _name: string
    ) {
        if (!this._name) {
            throw new Error('Invalid argument name: string');
        }
    }

    public getName(): string {
        return this._name;
    }

    public getSlugifyName(): string  {
        return slugify(
            this.getName(),
            {
                replacement: '.', // replace spaces with replacement character, defaults to `-`
                lower: true,      // convert to lower case, defaults to `false`
                remove: /[*+~.()'"!:@?%$]/g, // Remove these chartes matching regex
                strict: true,    // strip special characters except replacement, defaults to `false`
            }
        );
    }

    public equals(obj: unknown): boolean {
        if(typeof(obj) !== typeof(this)) {
            return false
        }

        const compareJob: Job = obj as Job;

        if(this.getSlugifyName() === compareJob.getSlugifyName()) {
            return true;
        }
        return false;
    }
}