
import { User } from 'domain/user/User';
import { Sequelize, DataTypes } from 'sequelize';
import { GroupsModel } from './models/GroupsModel';
import { JobModel } from "./models/JobModel";
import { PhoneTypeModel } from "./models/PhoneTypeModel";
import { RightModel } from './models/RightModel';
import { UserModel } from "./models/UserModel";
import { UserPhone } from './models/UserPhone';
import { UserPwdHistory } from './models/UserPwdHistory';
import { UserRightModel } from './models/UserRightModel';

export class Database {
  constructor(
    private orm: Sequelize
  ) {
    JobModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        uuid: {
          type: DataTypes.STRING
        },
        name: {
          type: DataTypes.STRING
          // allowNull defaults to true
        },
        description: {
          type: DataTypes.STRING
          // allowNull defaults to true
        },
        iconUrl: {
          type: DataTypes.STRING,
          field: 'url_icon'
        }
      },
      {
        sequelize: this.orm,
        tableName: "jobs",
        timestamps: false,
      });

    PhoneTypeModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING
          // allowNull defaults to true
        }
      },
      {
        sequelize: this.orm,
        tableName: "phone_type",
        timestamps: false,
      });

    UserModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        username: {
          type: DataTypes.STRING
          // allowNull defaults to true
        },
        uuid: {
          type: DataTypes.STRING
        },
        firstname: {
          type: DataTypes.STRING
        },
        lastname: {
          type: DataTypes.STRING
        },
        password: {
          type: DataTypes.STRING
        },
        passwordDateLimit: {
          type: DataTypes.DATE,
          field: 'password_datelimit'
        },
        birthdate: {
          type: DataTypes.DATE
        },
        email: {
          type: DataTypes.STRING
        },
        imgUrl: {
          type: DataTypes.STRING,
          field: 'img_url'
        },
        sshPublicKey: {
          type: DataTypes.STRING,
          field: 'ssh_publickey'
        },
        sshPrivateKey: {
          type: DataTypes.STRING,
          field: 'ssh_privatekey'
        },
        creationDate: {
          type: DataTypes.DATE,
          field: 'creation_date'
        },
        updateDate: {
          type: DataTypes.DATE,
          field: 'update_date'
        },
        expirationDate: {
          type: DataTypes.DATE,
          field: 'expiration_date'
        },
        disableDate: {
          type: DataTypes.DATE,
          field: 'disable_date'
        }
      },
      {
        sequelize: this.orm,
        tableName: "users",
        timestamps: false,
      });

    UserPhone.init(
      {
        value: {
          type: DataTypes.STRING
        },
        idUser: {
          type: DataTypes.INTEGER,
          field: 'id_user'
        },
        idPhoneType: {
          type: DataTypes.INTEGER,
          field: 'id_phonetype'
        }
      },

      {
        sequelize: this.orm,
        tableName: "user_phones",
        timestamps: false,
      });
    UserPhone.removeAttribute('id');

    UserPwdHistory.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        updateDate: {
          type: DataTypes.DATE,
          field: 'update_date'/*,
                    references:{
                        model: PhoneType,
                        key:'id'
                    }*/
          // allowNull defaults to true
        },
        password: {
          type: DataTypes.STRING
        }
      },
      {
        sequelize: this.orm,
        tableName: "users_pwd_history",
        timestamps: false,
      });

    GroupsModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        uuid: {
          type: DataTypes.STRING
        },
        name: {
          type: DataTypes.STRING
          // allowNull defaults to true
        },
        description: {
          type: DataTypes.STRING
          // allowNull defaults to true
        },
        imgUrl: {
          type: DataTypes.STRING,
          field: 'img_url'
          // allowNull defaults to true
        }
      },
      {
        sequelize: this.orm,
        tableName: "groups",
        timestamps: false,
      });

    RightModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING
          // allowNull defaults to true
        },
        description: {
          type: DataTypes.STRING
          // allowNull defaults to true
        }
      },
      {
        sequelize: this.orm,
        tableName: "rights",
        timestamps: false,
      });

    UserRightModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        idUser: {
          type: DataTypes.INTEGER,
          field: 'id_user'
        },
        idRight: {
          type: DataTypes.INTEGER,
          field: 'id_right'
        },
        idImpactedGroup: {
          type: DataTypes.INTEGER,
          field: 'id_impacted_group'
        },
        idImpactedUser: {
          type: DataTypes.INTEGER,
          field: 'id_impacted_user'
        }
      },

      {
        sequelize: this.orm,
        tableName: "user_rights",
        timestamps: false,
      });

    JobModel.hasMany(UserModel, { as: 'users', foreignKey: 'id_job' });
    UserModel.belongsTo(JobModel, { as: 'job', foreignKey: 'id_job' });
    UserModel.removeAttribute('JobModelId');

    UserModel.hasMany(UserPhone, { as: 'phones', foreignKey: 'id_user' });
    UserPhone.belongsTo(UserModel, { as: 'user', foreignKey: 'id_user' });
    PhoneTypeModel.hasMany(UserPhone, { as: 'phones', foreignKey: 'id_phonetype' });
    UserPhone.belongsTo(PhoneTypeModel, { as: 'type', foreignKey: 'id_phonetype' });

    UserModel.hasMany(UserPwdHistory, { as: 'passwords', foreignKey: 'id_user' });
    UserPwdHistory.belongsTo(UserModel, { as: 'user', foreignKey: 'id_user' });
    UserPwdHistory.removeAttribute('UserModelId');

    GroupsModel.hasMany(GroupsModel, { as: 'groups', foreignKey: 'id_parentgroup' });
    GroupsModel.belongsTo(GroupsModel, { as: 'parentGroup', foreignKey: 'id_parentgroup' });
    GroupsModel.removeAttribute('GroupsModelId');

    UserModel.belongsToMany(GroupsModel, {
      through: 'user_groups',
      as: 'groups',
      foreignKey: 'id_user',
      timestamps: false
    });
    GroupsModel.belongsToMany(UserModel, {
      through: 'user_groups',
      as: 'users',
      foreignKey: 'id_group',
      timestamps: false
    });

    RightModel.belongsToMany(UserModel, {
      through: 'user_rights',
      as: ''
    })
  }

  async updatePassword(uuid: string, password: string) {
    await UserModel.update({ password: password }, {
      where: {
        uuid: uuid
      }
    });
  }

  // JobModel
  getJob(jobId: string): Promise<JobModel> {
    return JobModel.findOne({ where: { uuid: jobId } });
  }

  deleteJob(jobId: string) {
    JobModel.destroy({
      where: {
        uuid: jobId
      }
    });
  }

  deleteGroup(groupId: string){
    GroupsModel.destroy({
      where: {
        uuid: groupId
      }
    });
  }

  createJob(job: JobModel) {
    job.save();
  }

  updateJob(job: JobModel) {
    job.save();
  }

  // UserModel
  createUser(user: UserModel) {
    user.save();
  }

  getUsers(): Promise<UserModel[]> {
    return UserModel.findAll();
  }

  getGroups(): Promise<GroupsModel[]> {
    return GroupsModel.findAll();
  }

  getUser(uuid: string): Promise<UserModel> {
    return UserModel.findOne({ where: { uuid } });
  }

  deleteUser(userId: string) {
    UserModel.destroy({
      where: {
        uuid: userId
      }
    })
  }

  /*createUserPhone(uuid:string,phone:string,type:string){
        this.getUser(uuid)
        .then(response=>{
            this.getPhoneType(type)
            .then(res=>{
                const userPhone = new UserPhone({value:phone,idUser:response.id,idPhoneType:res.id});
                userPhone.save();
            })
        })
    }*/

  /*getUserPhone(uuid:string,phone:string,type:string): Promise<UserPhone>{
        this.getUser(uuid)
        .then(response=>{
            this.getPhoneType(type)
            .then(res=>{
                return UserPhone.findOne({where:{idUser:}})
            })
        })
    }

    updateUserPhone(uuid:string,)*/

  getPhoneType(name: string): Promise<PhoneTypeModel> {
    return PhoneTypeModel.findOne({ where: { name } });
  }

  getJobUser(user: UserModel): Promise<JobModel> {
    return user.getJob();
  }

  setJobUser(user: UserModel, job: JobModel) {
    user.setJob(job).then((res: any) => console.log(res));
  }

  /*createUserPhone(userPhone: UserPhone){
        userPhone.save();
    }*/

  createPhoneType(phoneType: PhoneTypeModel) {
    phoneType.save();
  }

  getPhoneTypes(): Promise<PhoneTypeModel[]> {
    return PhoneTypeModel.findAll().then((response: any) => response.map((phoneTypeJson: any) => phoneTypeJson.dataValues));
  }

  getUserPhones(): Promise<UserPhone[]> {
    return UserPhone.findAll().then((response: any) => response.map((userPhoneJson: any) => userPhoneJson.dataValues));
  }











  getJobs(): Promise<JobModel[]> {
    return JobModel.findAll()
      .then((response: any) => response.map((jobJson: any) => jobJson.dataValues));
  }

  getJobUsers(job: JobModel): Promise<UserModel[]> {
    return job.getUsers();
  }
}