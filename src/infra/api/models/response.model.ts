export class ResponseModel {
    constructor(
        readonly status: number,
        readonly message: string,
        readonly response?: unknown
    ) {
        this.response = response || {};
    }
}