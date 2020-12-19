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
                    value:{
                        type: DataTypes.STRING
                    },
                    idUser:{
                        type: DataTypes.INTEGER,
                        field: 'id_user'
                    },
                    idPhoneType:{
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
                tableName: "users_pwd_history",
                timestamps: false,
            });
        JobModel.hasMany(UserModel, {as:'users', foreignKey: 'id_job' });
        UserModel.belongsTo(JobModel,{as:'job',foreignKey: 'id_job'});
        UserModel.removeAttribute('JobModelId');

        UserModel.hasMany(UserPhone,{as:'phones',foreignKey:'id_user'});
        UserPhone.belongsTo(UserModel,{as:'user',foreignKey:'id_user'});
        PhoneType.hasMany(UserPhone,{as:'phones',foreignKey:'id_phonetype'});
        UserPhone.belongsTo(PhoneType,{as:'type',foreignKey:'id_phonetype'});


        /*UserModel.hasMany(UserPhone,{as:'phones',foreignKey:'id_user'});
        UserPhone.belongsTo(UserModel,{as:'user',foreignKey:'id_user'});
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

    createUserPhone(uuid:string,phone:string,type:string){
        this.getUser(uuid)
        .then(response=>{
            this.getPhoneType(type)
            .then(res=>{
                const userPhone = new UserPhone({value:phone,idUser:response.id,idPhoneType:res.id});
                userPhone.save();
            })
        })
    }

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

    createUser(user: UserModel){
        user.save();
    }

    updateUser(user: UserModel){
        user.save();
    }

    getUser(uuid: string): Promise<UserModel>{
        return UserModel.findOne({ where: { uuid } });
    }

    getUsers(): Promise<UserModel[]>{
        return UserModel.findAll().then((response : any) => response.map((jobJson : any)=> jobJson.dataValues));
    }



    getJobs(): Promise<JobModel[]>{
        return JobModel.findAll()
          .then((response : any) => response.map((jobJson : any)=> jobJson.dataValues));
    }

    getJobUsers(job: JobModel): Promise<UserModel[]>{
        return job.getUsers();
    }
}