export class ConfigPaths {
  public readonly paths: string[] = [];

  constructor(env?: string, configPath?: string) {
    this.paths = [
      "/etc/default/koleg/config",
      "/etc/koleg/config",
      "./config",
    ];
    if(env) {
      this.paths = [
        "/etc/default/koleg/config",
        `/etc/default/koleg/config-${env}`,
        "/etc/koleg/config",
        `/etc/koleg/config-${env}`,
        `./configs/${env}`,
        "./config",
        `./config-${env}`,
      ];
    }
    this.paths = this._getPathWithExtention();
    if(configPath) {
      this.paths.push(configPath);
    }
  }

  private _getPathWithExtention(): string[] {
    const pathsWithExtention: string[] = [];
    this.paths.forEach(
      configPath => {
        pathsWithExtention.push(`${configPath}.yaml`);
        pathsWithExtention.push(`${configPath}.yml`);
      }
    );
    return pathsWithExtention;
  }

}
