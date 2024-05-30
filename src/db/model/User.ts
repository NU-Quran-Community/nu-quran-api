import { Model, DataTypes } from "sequelize";
import connection from "../connection";


enum Role { "user", "admin" };


class User extends Model {
    declare pk: number;
    declare id: string;
    declare role: Role;
    declare name: string;
    declare mentor_pk: number;
    declare referrer_pk: number;
    declare hashed_password: string;
}


User.init(
    {
        pk: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id: {
            type: DataTypes.UUID,
            unique: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mentor_pk: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User,
                key: "pk"
            }
        },
        referrer_pk: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User,
                key: "pk"
            }
        },
        hashed_password: {
            type: DataTypes.STRING,
            defaultValue: "abc"
        },
        role: {
            type: DataTypes.ENUM,
            values: ['user', 'admin']
        },
    },
    { sequelize: connection },
);


export default User;