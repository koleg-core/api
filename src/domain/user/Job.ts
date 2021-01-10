import { default as slugify } from "slugify";
import { v4 as uuid } from "uuid";

export class Job {

  private readonly descriptionMaxLength = 255;

  constructor(
    private id: string,
    private name: string,
    private description: string,
    private iconUrl: URL
  ) {
    if (!this.name) {
      throw new Error("Invalid argument name: string");
    }

    if (!this.id) {
      this.id = uuid();
    }

    if (description && description.length > this.descriptionMaxLength) {
      throw new Error("Description max length is: " + this.descriptionMaxLength);
    }
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getIconUrl(): URL {
    return this.iconUrl;
  }

  public getSlugifyName(): string {
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

    if (this.getSlugifyName() === job.getSlugifyName()) {
      return true;
    }
    return false;
  }
}
