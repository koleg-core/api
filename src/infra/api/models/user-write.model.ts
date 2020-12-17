import { PhoneNumberModel } from "./phoneNumber.model"

export class UserWriteModel {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly username: string,
        public readonly birthdate: string,
        public readonly email: string,
        public readonly groupIds: string[],
        public readonly imgUrl: string,
        public readonly job: string,
        public readonly phone: PhoneNumberModel, // TODO multiple phones numbers
        public readonly passwordHash: string,
        public readonly sshKey: string = null,
        public readonly passwordDatelimit: string = null,
        public readonly expirationDate: string = null
    ) {}
}