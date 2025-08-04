// user.model.ts
import { UUID } from 'crypto';
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Campus } from './campus.entity';
import { Department } from './department.entity';
import { User } from 'src/users/entities/user.entity';
import { DocumentRequest } from 'src/document-request/entities/document-request.entity';

@Table({ tableName: 'faculties' })
export class Faculty extends Model<Faculty> {

    @PrimaryKey
    @AutoIncrement
    @Column
    declare id: number;

    @ForeignKey(() => Campus)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    campusId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    departments: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    dean: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    stamp: string;

    @BelongsTo(() => Campus)
    campus: Campus

    @HasMany(() => Department)
    department: Department[]

    @HasMany(() => DocumentRequest)
    documentRequest: DocumentRequest[]

    @HasMany(() => User)
    users: User[];
}
