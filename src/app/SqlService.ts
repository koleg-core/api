import {Sequelize} from "sequelize";
import {Database} from "../infra/database/Database";

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

const test = new SqlService();


/*test.getDatabase().getJob().findAll()
.then((response : any) => console.log(response))
.catch((e : any) => console.error(e));
// console.log(jobs.every(job => job instanceof Job)); // true
// console.log("All jobs:", JSON.stringify(jobs, null, 2));*/