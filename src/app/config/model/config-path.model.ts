export class ConfigsPaths {
  public readonly configsPath: string[] = [];

  constructor(env: string) {
    this.configsPath = [
      "/etc/default/koleg/config",
      `/etc/default/koleg/config-${env}`,
      "/etc/koleg/config",
      `/etc/koleg/config-${env}`,
      `./configs/${env}`,
      `./configs/${env}`,
      "./config",
      `./config-${env}`,
    ];
    this.configsPath = this._getPathWithExtention();
  }

  private _getPathWithExtention(): string[] {
    const configsPathWithExtention: string[] = [];
    this.configsPath.forEach(
      configPath => {
        configsPathWithExtention.push(`${configPath}.yaml`);
        configsPathWithExtention.push(`${configPath}.yml`);
      }
    );
    return configsPathWithExtention;
  }
}
