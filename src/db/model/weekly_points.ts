import { Model, DataType, DataTypes } from "sequelize";
import connection from "../connection";
import User from "./User";


enum State { "execused", "absent", "present" };


class WeeklyPoints extends Model {
    declare user_pk: number;
    declare date: string;
    declare points: number;
    declare comments: string;
    declare state: State;
}


WeeklyPoints.init(
    {
        user_pk: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: User,
                key: "pk"
            }
        },
        date: {
            type: DataTypes.DATE,
            primaryKey: true,
        },
        points: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        comments: {
            type: DataTypes.STRING,
            allowNull: true
        },
        state: {
            type: DataTypes.ENUM,
            values: ["execused", "absent", "present"]
        }
    },
    { sequelize: connection },
);


export default WeeklyPoints;