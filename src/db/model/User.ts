import { DataTypes } from "sequelize";
import { AutoIncrement, BeforeCreate, BelongsTo, Column, DataType, ForeignKey, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import hash from "../../utils/hash";
import connection from "../connection";
import ExpressError from "../../utils/ExpressError";


enum Role {'admin', 'user'};


@Table({
    tableName: 'user',
    timestamps: true,
    modelName: 'User'
})
class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER
    })
    declare pk: number;

    @Column({
        type: DataType.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    })
    declare id: string;

    @Column({
        type: DataType.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    })
    declare email: string;

    @Column({
        type: DataType.ENUM,
        values: ['user', 'admin'], 
        defaultValue: 'user'
    })
    declare role: Role;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    @ForeignKey(() => User)
    declare mentor_pk: number;

    @Column({ type: DataType.VIRTUAL })
    declare mentor_id?: string;
    
    @BelongsTo(() => User, {
        as: 'mentor',
        foreignKey: 'mentor_pk'
    })
    declare mentor: User

    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    @ForeignKey(() => User)
    declare referrer_pk: number;


    @Column({ type: DataType.VIRTUAL })
    declare referrer_id?: string;
    
    @BelongsTo(() => User, {
        as: 'referrer',
        foreignKey: 'referrer_pk',
    })
    declare referrer: User

    @Column({
        type: DataType.STRING,
        defaultValue: 'abc'
    })
    declare hashed_password: string;

    @Column({
        type: DataType.VIRTUAL,
        defaultValue: '12345'
    })
    declare password: string;

    @BeforeCreate
    static async hash_password(instance: User){
        const hashed_password = await hash(instance.password)
        instance.setDataValue("hashed_password", hashed_password)
    }

    @BeforeCreate
    static async convert_referrer_id_to_pk(instance: User){
        if (instance.getDataValue("referrer_pk") || !instance.referrer_id) return ;
        
        const u = await User.findOne({ where: { id: instance.getDataValue("referrer_id") }})
        if(!u) throw new ExpressError("Wrong referrer id", 404);

        instance.setDataValue("referrer_pk", u.pk);
    }

    @BeforeCreate
    static async convert_mentor_id_to_pk(instance: User) {
        if (instance.getDataValue("mentor_pk") || !instance.mentor_id) return;

        const u = await User.findOne({ where: { id: instance.getDataValue("mentor_id") } })
        if (!u) throw new ExpressError("Wrong mentor id", 404);
        
        instance.setDataValue("mentor_pk", u.pk);
    }
};

connection.addModels([User])

export default User;