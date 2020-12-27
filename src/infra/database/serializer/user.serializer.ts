import { StatelessUser } from "../../../domain/user/StatelessUser";
import { UserModel } from "infra/database/models/UserModel";
import { SerializerRoot } from "./serializer-root";
import { JobSerializer } from "./job.serializer";
import { PhoneNumber } from "domain/user/PhoneNumber";
import { PhoneNumberSerializer } from "./phone-number.serializer";
import { UserIdentity } from "domain/user/UserIdentity";
import { Password } from "domain/user/Password";
import { SshKey } from "domain/user/SshKey";
import { UserPhone } from "../models/UserPhone";
import { PhoneTypeSerializer } from "./phone-type.serializer";

export class UserSerializer implements SerializerRoot<StatelessUser, UserModel> {

    public serialize(user: StatelessUser): UserModel {
        let userModel = new UserModel({uuid: user.id, username: user.identity.username, firstname: user.identity.firstName, 
            lastname: user.identity.lastName, password: user.identity.lastName, passwordDateLimit: user.password.getDateLimit(),
        birthdate: user.birthdate, email: user.identity.email, imgUrl: user.profilePictureUrl.toString(), sshPublicKey: user.sshKey.publicKey,
        sshPrivateKey: user.sshKey.privateKey, creationDate: user.creationDate, updateDate: user.updateDate,expirationDate: user.expirationDate,
        disableDate: user.disableDate});
        const job = JobSerializer.prototype.serialize(user.job);
        let phoneNumbers: UserPhone[] = [];
        const phones = user.phoneNumbers;
        for(const phone of phones){
            const phoneType = PhoneTypeSerializer.prototype.serialize(phone.type);
            let userPhone = PhoneNumberSerializer.prototype.serialize(phone);
            userPhone.type = phoneType;
            userPhone.user = userModel;
            phoneNumbers.push(userPhone);
        }
        userModel.job = job;
        userModel.phones = phoneNumbers;
        /*let groups: GroupsModel[] = [];
        for(const groupId of user.groupsIds){
            const groupModel = await GroupsModel.prototype.getGroupFromUuid(groupId);
        }*/
        return userModel; 
    }

    public async deserialize(userModel: UserModel): Promise<StatelessUser> {
        const job = await JobSerializer.prototype.deserialize(await userModel.getJob());
        let phones: PhoneNumber[] = [];
        const userPhones = await userModel.getPhones();
        for(const phone of userPhones){
            phones.push(await PhoneNumberSerializer.prototype.deserialize(phone));
        }
        let passwordHistory: Password[] = [];
        const pwdHistory = await userModel.getPasswords();
        for(const pwd of pwdHistory){
            passwordHistory.push(new Password(pwd.password,null));
        }
        let groupsIds: string[] = [];
        const userGroups = await userModel.getGroups();
        for(const group of userGroups){
            groupsIds.push(group.uuid);
        }
        return new StatelessUser(userModel.uuid,userModel.creationDate,userModel.updateDate,new UserIdentity(userModel.firstname,userModel.lastname,userModel.username,userModel.email)
            ,new Password(userModel.password,userModel.passwordDateLimit),userModel.birthdate
            ,passwordHistory,phones,groupsIds,job,userModel.disableDate,new URL(userModel.imgUrl),new SshKey(userModel.sshPrivateKey,userModel.sshPublicKey),userModel.expirationDate);
    }
}