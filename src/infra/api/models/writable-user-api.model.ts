import { SshKey } from "../../../domain/user/SshKey";
import { UserIdentity } from "../../../domain/user/UserIdentity";
import { PhoneNumber } from "../../../domain/user/PhoneNumber";
import { PhoneNumberApiModel } from "./phone-number-api.model"
import { JobApiModel } from "./job-api.model";
import { StatelessUser } from "../../../domain/user/StatelessUser";

export class WritableUserApiModel {

    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly username: string,
        public readonly birthdate: string,
        public readonly email: string,
        public readonly groupIds: string[],
        public readonly profilePictureUrl: string,
        public readonly job: JobApiModel,
        public readonly phones: PhoneNumberApiModel[], // TODO multiple phones numbers
        public readonly sshPublicKey: string = null,
        public readonly sshPrivateKey: string = null,
        public readonly expirationDate: string = null,
        public readonly disableDate: string = null
    ) {
    }

    public static toWritableUserApiModel(user: StatelessUser): WritableUserApiModel {

        const phones: PhoneNumberApiModel[] = [];
        if (Array.isArray(user.phoneNumbers) && user.phoneNumbers.length > 0) {
            user.phoneNumbers.forEach(phone => phones.push(PhoneNumberApiModel.toPhoneNumberApiModel(phone)));
        }

        return new WritableUserApiModel(
            user.identity.firstName,
            user.identity.lastName,
            user.identity.username,
            user.birthdate.toISOString(),
            user.identity.email,
            user.groupsIds,
            user.profilePictureUrl.toString(),
            JobApiModel.toJobModel(user.job),
            phones,
            user.sshKey.publicKey,
            user.sshKey.privateKey,
            user.expirationDate.toISOString(),
            user.disableDate.toISOString()
        );
    }

    public toStatelessUser(id: string = null): StatelessUser {
        if (Array.isArray(this.phones) && this.phones.length > 0) {
            this.phones.forEach(phone => phones.push(phone.toPhoneNumber()))
        }

        const phones: PhoneNumber[] = [];

        return new StatelessUser(
            id,
            null,
            null,
            new UserIdentity(this.firstName, this.lastName, this.username, this.email),
            null,
            new Date(this.birthdate),
            null,
            phones,
            this.groupIds,
            this.job.toJob(),
            new Date(this.disableDate),
            new URL(this.profilePictureUrl),
            new SshKey(this.sshPrivateKey, this.sshPublicKey),
            new Date(this.expirationDate)
        );
    }
}
