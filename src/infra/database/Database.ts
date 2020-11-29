import { Sequelize, DataTypes } from 'sequelize';
import { Job } from "./models/Job";

export class Database {
    constructor(
        private orm: Sequelize
    ) {
        Job.init(
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
        Job.create({ name: "toto" }).then((job: Job) => {
            console.log(job);
        });
    }
}