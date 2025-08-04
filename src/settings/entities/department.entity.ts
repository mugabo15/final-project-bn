// user.model.ts
import { UUID } from 'crypto';
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { User } from 'src/users/entities/user.entity';
import { Faculty } from './faculity.entity';
import { DocumentRequest } from 'src/document-request/entities/document-request.entity';

@Table({ tableName: 'departments' })
export class Department extends Model<Department> {

    @PrimaryKey
    @AutoIncrement
    @Column
    declare id: number;

    @ForeignKey(() => Faculty)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    facultyId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    dean: string;

    @BelongsTo(() => Faculty)
    faculty: Faculty;

    @HasMany(() => User)
    users: User[];

    @HasMany(() => DocumentRequest)
        documentRequest: DocumentRequest[]

}
