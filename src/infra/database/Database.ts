import { Sequelize, DataTypes } from 'sequelize';
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
                }
            },
            {
                sequelize: this.orm,
                tableName: "users",
                timestamps: false,
            });

        UserPhone.init(
                {
                    idUser: {
                        type: DataTypes.INTEGER,
                        field: 'id_user'
                    },
                    idPhonetype: {
                        type: DataTypes.INTEGER,
                        field: 'id_phonetype'/*,
                        references:{
                            model: PhoneType,
                            key:'id'
                        }*/
                        // allowNull defaults to true
                    },
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
                    idUser:{
                        type: DataTypes.INTEGER,
                        field: 'id_user'
                    },
                    password:{
                        type: DataTypes.STRING
                    }
                },
                {
                    sequelize: this.orm,
                    tableName: "user_phones",
                    timestamps: false,
                });

        // PhoneType.belongsToMany(User,{ through: 'user_phones' });
        // User.belongsToMany(PhoneType,{ through: 'user_phones' });

    }

    createUserPhone(userPhone: UserPhone){
        userPhone.save();
    }

    createPhoneType(phoneType: PhoneType){
        phoneType.save();
    }

    getPhoneTypes(): Promise<PhoneType[]>{
        return PhoneType.findAll().then((response : any) => response.map((phoneTypeJson : any)=> phoneTypeJson.dataValues));
    }

    getUserPhones(): Promise<UserPhone[]>{
        return UserPhone.findAll().then((response : any) => response.map((userPhoneJson : any)=> userPhoneJson.dataValues));
    }

    createUser(user: UserModel){
        user.save();
    }

    updateUser(user: UserModel){
        user.save();
    }

    getUser(uuid: string): Promise<UserModel>{
        return UserModel.findOne({ where: { uuid } }).then((response: any)=> response.dataValues);
    }

    getUsers(): Promise<UserModel[]>{
        return UserModel.findAll().then((response : any) => response.map((jobJson : any)=> jobJson.dataValues));
    }

    createJob(job: JobModel){
        console.log(job);
        job.save();
    }

    getJobs(): Promise<JobModel[]>{
        return JobModel.findAll()
          .then((response : any) => response.map((jobJson : any)=> jobJson.dataValues));
    }

    updateJob(job: JobModel){
        job.save();
    }

    deleteJob(job: JobModel){
        job.destroy();
    }




}