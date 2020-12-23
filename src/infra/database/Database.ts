
import { Sequelize, DataTypes } from 'sequelize';
import { GroupsModel } from './models/GroupsModel';
import { JobModel } from "./models/JobModel";
import {PhoneType} from "./models/PhoneType";
import {UserModel} from "./models/UserModel";
import { UserPhone } from './models/UserPhone';
import { UserPwdHistory } from './models/UserPwdHistory';

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
                name: {
                    type: DataTypes.STRING
                    // allowNull defaults to true
                }
            },
            {
                sequelize: this.orm,
                tableName: "jobs",
                timestamps: false,
            });

        PhoneType.init(
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
                uuid:{
                    type: DataTypes.STRING
                },
                firstname:{
                    type: DataTypes.STRING
                },
                lastname:{
                    type: DataTypes.STRING
                },
                password:{
                    type: DataTypes.STRING
                },
                passwordDateLimit:{
                    type: DataTypes.DATE,
                    field: 'password_datelimit'
                },
                birthdate:{
                    type: DataTypes.DATE
                },
                email:{
                    type: DataTypes.STRING
                },
                imgUrl:{
                    type: DataTypes.STRING,
                    field: 'img_url'
                },
                sshKey:{
                    type: DataTypes.BLOB,
                    field: 'ssh_key'
                },
                creationDate:{
                    type: DataTypes.DATE,
                    field: 'creation_date'
                },
                updateDate:{
                    type: DataTypes.DATE,
                    field: 'update_date'
                },
                expirationDate:{
                    type: DataTypes.DATE,
                    field: 'expiration_date'
                }
            },
            {
                sequelize: this.orm,
                tableName: "users",
                timestamps: false,
            });

        UserPhone.init(
                {
                    value:{
                        type: DataTypes.STRING
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
                password:{
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

        JobModel.hasMany(UserModel, {as:'users', foreignKey: 'id_job' });
        UserModel.belongsTo(JobModel,{as:'job',foreignKey: 'id_job'});
        UserModel.removeAttribute('JobModelId');

        UserModel.hasMany(UserPhone,{as:'phones',foreignKey:'id_user'});
        UserPhone.belongsTo(UserModel,{as:'user',foreignKey:'id_user'});
        PhoneType.hasMany(UserPhone,{as:'phones',foreignKey:'id_phonetype'});
        UserPhone.belongsTo(PhoneType,{as:'type',foreignKey:'id_phonetype'});

        /*UserModel.belongsToMany(PhoneType,{
            through: 'user_phones',
            as: 'phones',
            foreignKey: 'id_user',
            timestamps: false
        });

        PhoneType.belongsToMany(UserModel,{
            through: 'user_phones',
            as: 'users',
            foreignKey: 'id_user',
            timestamps: false
        });*/


        UserModel.hasMany(UserPwdHistory,{as:'passwords', foreignKey: 'id_user'});
        UserPwdHistory.belongsTo(UserModel,{as:'user',foreignKey: 'id_user'});
        UserPwdHistory.removeAttribute('UserModelId');

        GroupsModel.hasMany(GroupsModel, {as:'groups', foreignKey: 'id_parentgroup'});
        GroupsModel.belongsTo(GroupsModel, {as : 'parentGroup', foreignKey: 'id_parentgroup'});
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



        /*UserModel.hasMany(UserPhone,{as:'phones',foreignKey:'id_user'});
        UserPhone.belongsTo(UserModel,{as:'user',foreign(Key:'id_user'});
        UserPhone.removeAttribute('UserModelId');
        PhoneType.hasMany(UserPhone,{as:'phones',foreignKey:'id_phonetype'});
        UserPhone.belongsTo(PhoneType,{as:'phoneType',foreignKey:'id_phonetype'});
        UserPhone.removeAttribute('PhoneTypeId');*/
    }

    // JobModel
    getJob(name: string): Promise<JobModel>{
        return JobModel.findOne({where: {name}});
    }

    deleteJob(name: string){
        JobModel.destroy({
            where: {
                name
            }
        });
    }

    createJob(job: JobModel){
        job.save();
    }

    // UserModel
    createUser(user: UserModel){
        user.save();
    }

    updateUser(user: UserModel){
        this.getUser(user.uuid)
        .then(response=>{
            user.id = response.id;
            response = user;
            response.isNewRecord = false;
            response.save();
        })
    }

    getUsers(): Promise<UserModel[]>{
        return UserModel.findAll();
    }

    getUser(uuid: string): Promise<UserModel>{
        return UserModel.findOne({ where: { uuid } });
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

  getPhoneType(name:string):Promise<PhoneType>{
    return PhoneType.findOne({ where: { name } });
  }

  getJobUser(user: UserModel): Promise<JobModel>{
    return user.getJob();
  }

  setJobUser(user: UserModel, job: JobModel){
    user.setJob(job).then((res:any)=>console.log(res));
  }

  /*createUserPhone(userPhone: UserPhone){
        userPhone.save();
    }*/

  createPhoneType(phoneType: PhoneType){
    phoneType.save();
  }

  getPhoneTypes(): Promise<PhoneType[]>{
    return PhoneType.findAll().then((response : any) => response.map((phoneTypeJson : any)=> phoneTypeJson.dataValues));
  }

  getUserPhones(): Promise<UserPhone[]>{
    return UserPhone.findAll().then((response : any) => response.map((userPhoneJson : any)=> userPhoneJson.dataValues));
  }











  getJobs(): Promise<JobModel[]>{
    return JobModel.findAll()
      .then((response : any) => response.map((jobJson : any)=> jobJson.dataValues));
  }

  getJobUsers(job: JobModel): Promise<UserModel[]>{
    return job.getUsers();
  }
}