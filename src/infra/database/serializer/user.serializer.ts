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

export class UserSerializer implements SerializerRoot<StatelessUser, UserModel> {

  public async serialize(user: StatelessUser): Promise<UserModel> {
    const userExist = await UserModel.findOne({ where: { uuid: user.id } });
    let imgUrl;
    let sshPublicKey;
    let sshPrivateKey;
    let job;
    const phoneNumbers: UserPhone[] = [];
    const groups: GroupsModel[] = [];

    if (user.profilePictureUrl) {
      imgUrl = user.profilePictureUrl.toString();
    }
    if (user.sshKey) {
      sshPublicKey = user.sshKey.publicKey;
      sshPrivateKey = user.sshKey.privateKey;
    }
    const userModel = new UserModel({
      uuid: user.id, username: user.identity.username, firstname: user.identity.firstName,
      lastname: user.identity.lastName, password: user.identity.lastName, passwordDateLimit: user.password.getDateLimit(),
      birthdate: user.birthdate, email: user.identity.email, imgUrl: imgUrl, sshPublicKey: sshPublicKey,
      sshPrivateKey: sshPrivateKey, creationDate: user.creationDate, updateDate: user.updateDate, expirationDate: user.expirationDate,
      disableDate: user.disableDate
    });
    if (userExist) {
      userModel.id = userExist.id;
      userModel.isNewRecord = false;
    }
    if (user.job) {
      job = await JobSerializer.prototype.serialize(user.job);
      userModel.job = job;
    }

    if (user.phoneNumbers) {
      for (const phone of user.phoneNumbers) {
        const phoneType = await PhoneTypeSerializer.prototype.serialize(phone.type);
        const userPhone = await PhoneNumberSerializer.prototype.serialize(phone);
        userPhone.idPhoneType = phoneType.id;
        phoneNumbers.push(userPhone);
      }
      userModel.phones = phoneNumbers;
    }

    if (user.groupsIds) {
      for (const id of user.groupsIds) {
        groups.push(await GroupsModel.findOne({ where: { uuid: id } }));
      }
      userModel.groups = groups;
    }




    return userModel;
  }

  public async deserialize(userModel: UserModel): Promise<StatelessUser> {
    console.log(userModel);

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
      userModel.creationDate,
      userModel.updateDate,
      new UserIdentity(userModel.firstname, userModel.lastname, userModel.username, userModel.email),
      new Password(userModel.password, userModel.passwordDateLimit),
      userModel.birthdate,
      passwordHistory,
      phones,
      groupsIDs,
      job,
      userModel.disableDate,
      imageURL,
      sshKey,
      userModel.expirationDate
    );
  }
}