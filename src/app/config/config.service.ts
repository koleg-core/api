import * as YAML from "yaml";
import convict from "convict";
import { url } from "convict-format-with-validator";

import { ConfigPaths } from "./model/config-path.model";
import { configModel } from "./model/config-model";

export class ConfigService {
  private readonly configModel = configModel;
  private readonly convict = convict;
  private readonly configPath = new ConfigPaths(
    process.env.NODE_ENV,
    process.env.KOLEG_CONFIG_PATH
  );

  private readonly config: convict.Config<any>;

  constructor() {
    this.convict.addParser(
      { extension: ["yml", "yaml"],
        parse: YAML.parse
      });
    this.convict.addFormat(url);
    this.config = convict(this.configModel);
  }

  public getConfig(configString: string): any {
    return this.config.get(configString);
  }

  public init() {
    for(const configFile of this.configPath.paths) {
      try {
        this.config.loadFile(configFile);
        console.log("INFO",  `${configFile} LOADED`);
      } catch(e) {
        console.log("INFO",  `${configFile} not found skipping`);
      }
    }
  }

  private readFile(filePath: string) {
    this.config.loadFile(filePath);
  }
}
