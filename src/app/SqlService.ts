import {Sequelize} from "sequelize";
import { JobModel } from "../infra/database/models/JobModel";
import {Database} from "../infra/database/Database";
import { UserModel } from "../infra/database/models/UserModel";
import { Job } from "../domain/Job";
import { JobSerializer } from "../infra/database/serializer/JobSerializer";
import { UserPhone } from "../infra/database/models/UserPhone";

export class SqlService {
    private orm: Sequelize;
    private database: Database;

    constructor(
        uri: string = "postgres://postgres:B2fpKNTvon@db-develop-postgresql:5432/postgres"
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

}

const sqlService = new SqlService();
/*const job = new Job("developpeur");
const jobModel = JobSerializer.serializeJob(job);
jobModel.id = 1;
const user = new UserModel();
user.id = 1;
// sqlService.getDatabase().setJobUser(user,jobModel);
// console.log(user);
// console.log(jobModel);
// sqlService.getDatabase().getJob("developpeur").then(response=>job=response);
/*let user;*/
// sqlService.getDatabase().getUsers().then(response =>console.log(response));
// let user;
/*sqlService.getDatabase().getJob('développeur')
.then(response=>{
    sqlService.getDatabase().getUser('uuid123')
        .then(res=>{
            sqlService.getDatabase().setJobUser(res,response);
        }
        )
        .catch(error=>console.log(error));

})
/*sqlService.getDatabase().getUser('uuid123')
.then(response=>{response.username='toto'; sqlService.getDatabase().updateUser(response)});*/

// sqlService.getDatabase().getUsers().then(response =>console.log(response));

// sqlService.getDatabase().getUser('95e491fe-32f6-42f2-b65b-8e4d80b7cb7b').then(response=>console.log(response.getJob()));
/*sqlService.getDatabase().getJob('Sales Associate')
.then(response=>{
    response.getUsers()
    .then((res:any)=>console.log(res));
})*/

/*sqlService.getDatabase().getPhoneType('PHONE_HOME')
.then(response=>{
    sqlService.getDatabase().getUser('a70e5a16-5ad1-41be-851f-0fe9a100ddb6')
    .then(res=>response.createUser(res));
})*/

/*sqlService.getDatabase().getUser('a70e5a16-5ad1-41be-851f-0fe9a100ddb6')
.then(response=>{
    response.getPhones()
    .then((res:any)=>{
        for(const entry of res){
            console.log(entry.value);
        }
    })
})*/
// sqlService.getDatabase().createUserPhone('a70e5a16-5ad1-41be-851f-0fe9a100ddb6','0689755656','PHONE_HOME');
const job = new JobModel({name:'testCreation'})
sqlService.getDatabase().createJob(job);
