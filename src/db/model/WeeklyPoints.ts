import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, Default, ForeignKey, Index, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import User from "./User";
import connection from "../connection";
import { UUIDV4 } from "sequelize";


enum State {'execused', 'absent', 'present'};


@Table({
    tableName: 'weekly_points',
    modelName: 'WeeklyPoints',
    timestamps: false
})
class WeeklyPoints extends Model{
    @Unique
    @Default(UUIDV4)
    @AllowNull(false)
    @Column(DataType.UUID)
    declare id: string;

    @PrimaryKey
    @Column(DataType.DATE)
    declare date: Date

    @ForeignKey(() => User)
    @PrimaryKey
    @Column(DataType.INTEGER)
    declare user_pk: number;
    
    @BelongsTo(()=> User, {
        foreignKey: 'user_pk',
        as: 'user'
    })
    declare user: User;

    @Default(0)
    @Column(DataType.INTEGER)
    declare points: number;

    @Column(DataType.STRING)
    declare comments: string

    @AllowNull(false)
    @Column(DataType.ENUM('execused', 'absent', 'present'))
    declare state: string
};


connection.addModels([WeeklyPoints]);
export default WeeklyPoints;