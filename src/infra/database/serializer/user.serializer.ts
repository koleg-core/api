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

export class UserSerializer implements SerializerRoot<StatelessUser, UserModel> {

  public async serialize(user: StatelessUser): Promise<UserModel> {
    const userExist = await UserModel.findOne({ where: { uuid: user.id } });
    let imgUrl;
    let sshPublicKey;
    let sshPrivateKey;
    let job;
    const phoneNumbers: UserPhone[] = [];
    const groups: GroupsModel[] = [];

    if(user.profilePictureUrl){
      imgUrl = user.profilePictureUrl.toString();
    }
    if(user.sshKey){
      sshPublicKey = user.sshKey.publicKey;
      sshPrivateKey = user.sshKey.privateKey;
    }
    const userModel = new UserModel({uuid: user.id, username: user.identity.username, firstname: user.identity.firstName, 
      lastname: user.identity.lastName, password: user.identity.lastName, passwordDateLimit: user.password.getDateLimit(),
      birthdate: user.birthdate, email: user.identity.email, imgUrl: imgUrl, sshPublicKey: sshPublicKey,
      sshPrivateKey: sshPrivateKey, creationDate: user.creationDate, updateDate: user.updateDate,expirationDate: user.expirationDate,
      disableDate: user.disableDate});
    if(userExist){
      userModel.id = userExist.id;
      userModel.isNewRecord = false;
    }
    if(user.job){
      job = await JobSerializer.prototype.serialize(user.job);
      userModel.job = job;
    }
        
    if(user.phoneNumbers){
      for(const phone of user.phoneNumbers){
        const phoneType = await PhoneTypeSerializer.prototype.serialize(phone.type);
        const userPhone = await PhoneNumberSerializer.prototype.serialize(phone);
        userPhone.idPhoneType = phoneType.id;
        phoneNumbers.push(userPhone);
      } 
      userModel.phones = phoneNumbers;
    }
        
    if(user.groupsIds){
      for(const id of user.groupsIds){
        groups.push(await GroupsModel.findOne({ where: { uuid: id } }));
      }
      userModel.groups = groups;
    }
        
        
        
        
    return userModel; 
  }

  public async deserialize(userModel: UserModel): Promise<StatelessUser> {
    const job = await JobSerializer.prototype.deserialize(await userModel.getJob());
    const phones: PhoneNumber[] = [];
    const userPhones = await userModel.getPhones();
    for(const phone of userPhones){
      phones.push(await PhoneNumberSerializer.prototype.deserialize(phone));
    }
    const passwordHistory: Password[] = [];
    const pwdHistory = await userModel.getPasswords();
    for(const pwd of pwdHistory){
      passwordHistory.push(new Password(pwd.password,null));
    }
    const groupsIds: string[] = [];
    const userGroups = await userModel.getGroups();
    for(const group of userGroups){
      groupsIds.push(group.uuid);
    }
    return new StatelessUser(userModel.uuid,userModel.creationDate,userModel.updateDate,new UserIdentity(userModel.firstname,userModel.lastname,userModel.username,userModel.email)
      ,new Password(userModel.password,userModel.passwordDateLimit),userModel.birthdate
      ,passwordHistory,phones,groupsIds,job,userModel.disableDate,new URL(userModel.imgUrl),new SshKey(userModel.sshPrivateKey,userModel.sshPublicKey),userModel.expirationDate);
  }
}