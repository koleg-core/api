import { Api } from "../infra/api/api";

export class App {

  constructor(
    private api: Api,
    private port: number = 8080
  ) {
    if (!this.api) {
      throw new Error("Invalid argument api: Api is not defined.");
    }

    this.api.config(this.port);
  }

  public start(): void {
    this.api.start();
  }

}
