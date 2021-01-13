import { default as slugify } from "slugify";
import { v4 as uuid } from "uuid";

import { Guard } from "core/guard";
import { Result } from "core/result";

export class Job {

  private readonly descriptionMaxLength: string;
  constructor(
    private id: string,
    private name: string,
    private description: string,
    private iconUrl: URL
  ) {}

  public static factory(
    id: string,
    name: string,
    description: string,
    iconUrl: URL
  ): Result<Job> {
    const nameGuardResult = Guard.againstNullOrUndefined(name, "name");
    if (!nameGuardResult.succeeded) {
      return Result.fail<Job>(nameGuardResult.message);
    }
    const nameSizeGuardResult = Guard.againstZeroSize(name, "name");
    if (!nameSizeGuardResult.succeeded) {
      return Result.fail<Job>(nameSizeGuardResult.message);
    }

    const idGuardResult = Guard.againstAmbiguousNullUndefined(id, "id");
    if(!idGuardResult.succeeded) {
      return Result.fail<Job>(idGuardResult.message);
    }
    const descriptionGuardResult = Guard.againstAmbiguousNullUndefined(description, "description");
    if(!descriptionGuardResult.succeeded) {
      return Result.fail<Job>(descriptionGuardResult.message);
    }
    const iconUrlGuardResult = Guard.againstAmbiguousNullUndefined(iconUrl, "iconUrl");
    if(!iconUrlGuardResult.succeeded) {
      return Result.fail<Job>(iconUrlGuardResult.message);
    }

    if (id === null) {
      id = uuid();
    }
    const descriptionMaxLength = 255;
    if (description && description.length > descriptionMaxLength) {
      return Result.fail<Job>(`description: "${description}" is grater than maximum description size: ${descriptionMaxLength}`);
    }
    return Result.ok<Job>(new Job(id, name, description, iconUrl));
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
