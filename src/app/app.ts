import { OrganisationRepository } from "../domain/repos/organisation.repository";
import { Api } from "../infra/api/api";

export class App {

    constructor(
        private _api: Api,
        private _port: number = 8080
    ) {
        if (!this._api) {
            throw new Error('Invalid argument api: Api is not defined.');
        }

        this._api.config(this._port);
    }

    public start(): void {
        this._api.start();
    }

}