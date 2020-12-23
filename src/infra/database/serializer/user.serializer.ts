import { StatelessUser } from "../../../domain/user/StatelessUser";
import { Job } from "../../../domain/user/Job";
import { JobModel } from "../models/JobModel";
import { UserModel } from "../models/UserModel";
import { SerializerRoot } from "./serializer-root";
import { JobSerializer } from "./job.serializer";

export class UserSerializer implements SerializerRoot<StatelessUser, UserModel> {

    public serialize(user: StatelessUser): UserModel {
        return null;
    }

    public deserialize(userModel: UserModel): StatelessUser {
        const job = JobSerializer.prototype.deserialize(userModel.getJob());
        return new StatelessUser(userModel.uuid,userModel.creationDate,userModel.updateDate,null,null,userModel.birthdate
            ,null,null,null,job,null,new URL(userModel.imgUrl),null,userModel.expirationDate);
    }
}