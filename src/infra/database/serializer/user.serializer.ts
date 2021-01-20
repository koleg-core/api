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
import { GroupsModel } from "../models/GroupsModel";
import { Job } from "domain/user/Job";
import { JobModel } from "../models/JobModel";
import { use } from "passport";

export class UserSerializer implements SerializerRoot<StatelessUser, UserModel> {

  public async serialize(user: StatelessUser): Promise<UserModel> {

    const userModel = new UserModel({
      uuid: user.id,
      username: user.identity ? user.identity.username : null,
      firstname: user.identity ? user.identity.firstName : null,
      lastname: user.identity ? user.identity.lastName : null,
      password: user.password ? user.password.getValue() : null,
      passwordDateLimit: user.password ? user.password.getDateLimit() : null,
      birthdate: user.birthdate ? user.birthdate : null,
      email: user.identity ? user.identity.email : null,
      imgUrl: user.profilePictureUrl ? user.profilePictureUrl.toString() : null,
      sshPublicKey: (user.sshKey && user.sshKey.publicKey) ? user.sshKey.publicKey : null,
      sshPrivateKey: (user.sshKey && user.sshKey.privateKey) ? user.sshKey.privateKey : null,
      creationDate: user.creationDate ? user.creationDate : null,
      updateDate: user.updateDate ? user.updateDate : null,
      expirationDate: user.expirationDate ? user.expirationDate : null,
      disableDate: user.disableDate ? user.disableDate : null
    });

    const userExist = await UserModel.findOne({ where: { uuid: user.id } });

    if (userExist) {
      userModel.id = userExist.id;
      userModel.isNewRecord = false;
    }

    let job = null;
    if (user.jobId) {
      job = await JobModel.findOne({ where: { uuid: user.jobId } });
    }
    userModel.job = job;

    const phoneNumbers: UserPhone[] = [];
    if (Array.isArray(user.phoneNumbers) && user.phoneNumbers.length > 0) {
      for await (let phone of user.phoneNumbers) {
        const phoneType = await PhoneTypeSerializer.prototype.serialize(phone.type);
        const userPhone = await PhoneNumberSerializer.prototype.serialize(phone);
        userPhone.idPhoneType = phoneType.id;
        phoneNumbers.push(userPhone);
      }
    }
    userModel.phones = phoneNumbers;

    const groups: GroupsModel[] = [];
    if (Array.isArray(user.groupsIds) && user.groupsIds.length > 0) {
      for await (let id of user.groupsIds) {
        groups.push(await GroupsModel.findOne({ where: { uuid: id } }));
      }
      userModel.groups = groups;
    }

    return userModel;
  }

  public async deserialize(userModel: UserModel): Promise<StatelessUser> {

    const jobModel = await userModel.getJob();
    let job: Job = null;
    if (jobModel) {
      job = await JobSerializer.prototype.deserialize(jobModel);
    }

    const phones: PhoneNumber[] = [];
    const phonesModel = await userModel.getPhones();
    if (Array.isArray(phonesModel) && phonesModel.length > 0) {
      for await (let phoneModel of phonesModel) {
        if (phoneModel) {
          phones.push(await PhoneNumberSerializer.prototype.deserialize(phoneModel));
        }
      }
    }

    const passwordHistory: Password[] = [];
    const passwordHistoryModel = await userModel.getPasswords();
    if (Array.isArray(passwordHistoryModel) && passwordHistoryModel.length > 0) {
      for await (let passwordModel of passwordHistoryModel) {
        if (passwordModel) {
          passwordHistory.push(new Password(passwordModel.password, null));
        }
      }
    }

    const groupsIDs: string[] = [];
    const userGroupsModel = await userModel.getGroups();
    if (Array.isArray(userGroupsModel) && userGroupsModel.length > 0) {
      for (let groupModel of userGroupsModel) {
        if (groupModel) {
          groupsIDs.push(groupModel.uuid);
        }
      }
    }

    let imageURL = null;
    if (userModel && userModel.imgUrl) {
      imageURL = new URL(userModel.imgUrl);
    }

    let sshKey = null;
    if (userModel.sshPrivateKey && userModel.sshPublicKey) {
      sshKey = new SshKey(userModel.sshPrivateKey, userModel.sshPublicKey);
    }

    return new StatelessUser(
      userModel.uuid,
      userModel.creationDate ? new Date(userModel.creationDate) : null,
      userModel.updateDate ? new Date(userModel.updateDate) : null,
      new UserIdentity(userModel.firstname, userModel.lastname, userModel.username, userModel.email),
      new Password(userModel.password, userModel.passwordDateLimit),
      userModel.birthdate ? new Date(userModel.birthdate) : null,
      passwordHistory,
      phones,
      groupsIDs,
      job.getId(),
      userModel.disableDate,
      imageURL,
      sshKey,
      userModel.expirationDate ? new Date(userModel.expirationDate) : null
    );
  }
}