import {Sequelize,QueryTypes} from "sequelize";
import { JobModel } from "../infra/database/models/JobModel";
import {Database} from "../infra/database/Database";
import { UserModel } from "../infra/database/models/UserModel";
import { JobSerializer } from "../infra/database/serializer/job.serializer";
import { UserPhone } from "../infra/database/models/UserPhone";
import { GroupsModel } from "../infra/database/models/GroupsModel";
import { UserSerializer } from "../infra/database/serializer/user.serializer";
import { Password } from "domain/user/Password";
import { Job } from "domain/user/Job";
import { PhoneType } from "domain/enums/phone-type.enum";
import { PhoneTypeSerializer } from "infra/database/serializer/phone-type.serializer";
import { User } from "domain/user/User";
import { StatelessUser } from "domain/user/StatelessUser";
import { UserIdentity } from "domain/user/UserIdentity";
import { GroupSerializer } from "infra/database/serializer/group.serializer";
import { RightModel } from "infra/database/models/RightModel";
import { UserRightModel } from "infra/database/models/UserRightModel";
export class SqlService {
    private orm: Sequelize;
    private database: Database;

    constructor(
      uri = "postgres://postgres:B2fpKNTvon@db-develop-postgresql:5432/postgres"
    ) {
      this.orm = new Sequelize(uri);
      this.database = new Database(this.orm);
    }

    getOrm(): Sequelize {
      return this.orm;
    }

    getDatabase(): Database {
      return this.database;
    }

  /*async testUser(){
        const userModel = await this.database.getUser('a70e5a16-5ad1-41be-851f-0fe9a100ddb6');
        const userSerialize = await UserSerializer.prototype.deserialize(userModel);

        let userInsert = new StatelessUser('testCreation3',userSerialize.creationDate,userSerialize.updateDate,
        new UserIdentity('test3','test3'),userSerialize.password,userSerialize.birthdate,null,userSerialize.phoneNumbers,
        userSerialize.groupsIds,userSerialize.job);
        const user2 = await UserSerializer.prototype.serialize(userInsert);
        await user2.saveUser();
    }*/

    /*async testGroup(){
        const groupModel = await GroupsModel.findOne({ where: { id: 10 } });
        const groupSerialize = await GroupSerializer.prototype.deserialize(groupModel);
        let groupInsert = new Group('testCreation3','testUpdate2',groupSerialize.getDescription(),groupSerialize,null,groupSerialize.getImgUrl());
        const groupSerialize2 = await GroupSerializer.prototype.serialize(groupInsert);
        await groupSerialize2.saveGroup();
        //console.log(groupSerialize2.parentGroup);
    }*/

    async testRight(){
      const right = await RightModel.findOne({ where: { name:'CREATE' } });
      const user = await this.database.getUser('a70e5a16-5ad1-41be-851f-0fe9a100ddb6');
      const userImpacted = await this.database.getUser('6435015a-9e61-412a-bb02-1403c714b432');
      const userRight = new UserRightModel({idUser:user.id,idRight:right.id,idImpactedGroup:userImpacted.id});
      console.log(userRight);
      await userRight.save();
    }

}

const test = new SqlService();
test.getDatabase().updatePassword('82ef7178-a48c-408c-93e5-361a461643ce','e<gfshpZUGHpzu');



