import { OrganisationRepository } from "../domain/OrganisationRepository";
import { Api } from "../infra/api/api";

export class App {

    constructor(
        private _api: Api,
        private _port: number = 8080
    ) {
        if (!this._api) {
            throw new Error('Invalid argument api: Api is not defined.');
        }
    }

    public start(): void {
        this._api.getApp().listen(this._port, () => console.log(`Koleg is listening on port ${this._port}!`));
    }

}