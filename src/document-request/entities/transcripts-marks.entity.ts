import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    ForeignKey,
    BelongsTo,
    AutoIncrement,
} from 'sequelize-typescript';
import { Department } from 'src/settings/entities/department.entity';
import { Faculty } from 'src/settings/entities/faculity.entity';


@Table({ tableName: 'transcrips' })
export class Transcript extends Model<Transcript> {
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
    referenceNo: string;

    @ForeignKey(() => Department)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    departmentId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    program: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    yearOfStudyName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    yearOfStudyYear: string;

    @Column({
        type: DataType.JSONB,
        allowNull: false,
    })
    marks: object;

    @Column(DataType.STRING)
    hodSignatureBy: string;

    @Column(DataType.DATE)
    hodSignatureAt: Date;

    @Column(DataType.TEXT)
    hodSignatureImage: string;

    @Column(DataType.STRING)
    deanSignatureBy: string;

    @Column(DataType.DATE)
    deanSignatureAt: Date;

    @Column(DataType.TEXT)
    deanSignatureImage: string;

    @Column(DataType.TEXT)
    schoolStampImage: string;

    @Column(DataType.DATE)
    schoolStampAt: Date;

    @Column({
        type: DataType.ENUM(
            'draft',
            'hod-approved',
            'hod-rejected',
            'dean-approved',
            'dean-rejected'
        ),
        defaultValue: 'draft',
    })
    status: 'draft' | 'hod-approved' | 'hod-rejected' | 'dean-approved' | 'dean-rejected';

    @BelongsTo(() => Faculty, { foreignKey: 'facultyId' })
    faculty: Faculty;

    @BelongsTo(() => Department, { foreignKey: 'departmentId' })
    department: Department;
}
