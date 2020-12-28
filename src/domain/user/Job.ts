import { default as slugify } from "slugify";

// while this class don't have any methods,
// It's will be useless
export class Job {

  constructor(
        private name: string
  ) {
    if (!this.name) {
      throw new Error("Invalid argument name: string");
    }
  }

  public getName(): string {
    return this.name;
  }

  public getSlugifyName(): string  {
    return slugify(
      this.getName(),
      {
        replacement: ".", // replace spaces with replacement character, defaults to `-`
        lower: true,      // convert to lower case, defaults to `false`
        remove: /[*+~.()'"!:@?%$]/g, // Remove these chartes matching regex
        strict: true,    // strip special characters except replacement, defaults to `false`
      }
    );
  }

  public hasSameName(job: Job): boolean {

    if(this.getSlugifyName() === job.getSlugifyName()) {
      return true;
    }
    return false;
  }
}
