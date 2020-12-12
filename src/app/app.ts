import { OrganisationRepository } from "../domain/OrganisationRepository";
import { Api } from "../infra/api/api";

export class App {

    constructor(
        private _api: Api,
        private _repository: OrganisationRepository,
        private _port: number = 8080
    ) {
        if(!this._api) {
            throw new Error('Invalid argument api: Api is not defined.');
        }
        if(!this._repository) {
            throw new Error('Invalid argument repository: OrganisationRepository is not defined.');
        }
    }

    public start() {
        this._api.app.listen(this._port, () => console.log(`Example app listening on port ${this._port}!`));
    }

}