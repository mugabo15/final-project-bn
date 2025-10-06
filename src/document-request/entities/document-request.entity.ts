import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  PrimaryKey,
  AllowNull,
} from 'sequelize-typescript';
import { Department } from 'src/settings/entities/department.entity';
import { Faculty } from 'src/settings/entities/faculity.entity';
import { User } from 'src/users/entities/user.entity';

@Table({ tableName: 'document_request' })
export class DocumentRequest extends Model<DocumentRequest> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;
  @Column({
    type: DataType.ENUM(
      'transcript',
      'recommendation',
      'to whom',
      'certificate of attendance',
      'proof of english',
      'internship',
      'degree diploma',
    ),
    allowNull: false,
  })
  documentType:
    | 'transcript'
    | 'recommendation'
    | 'to whom'
    | 'certificate of attendance'
    | 'proof of english'
    | 'internship'
    | 'degree diploma';

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column({ type: DataType.STRING })
  firstName: string;

  @Column({ type: DataType.STRING })
  lastName: string;

  @Column({ type: DataType.STRING })
  regNumber: string;

  @Column({ type: DataType.DATEONLY })
  date: Date;
  @ForeignKey(() => Faculty)
  @Column({ type: DataType.INTEGER })
  faculty: number;
  @BelongsTo(() => Faculty, { foreignKey: 'faculty' })
  facultyId: Faculty;

  @ForeignKey(() => Department)
  @Column({ type: DataType.INTEGER })
  department: number;
  @BelongsTo(() => Department, { foreignKey: 'department' })
  departmentId: Department;

  @Column({ type: DataType.STRING })
  program: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  price: number;

  @Column({ type: DataType.STRING })
  level: string;

  @Column({ type: DataType.STRING })
  courseName: string; // Optional - used for Recommendation & Attendance

  @Column({ type: DataType.STRING })
  phoneNumber: string;

  @Column({ type: DataType.STRING })
  idCard: string;

  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  fileUrl: string;

  @Column({
    type: DataType.ENUM(
      'pending',
      'approved',
      'rejected',
      'recoveryApproved',
      'recoveryRejected',
      'libraryApproved',
      'libraryRejected',
      'staffApproved',
      'staffRejected',
      'deanApproved',
      'deanRejected',
      'registrationApproved',
      'registrationRejected',
      'chancellorApproved',
      'chancellorRejected',
      'completed',
    ),
    defaultValue: 'pending',
  })
  status:
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'recoveryApproved'
    | 'recoveryRejected'
    | 'libraryApproved'
    | 'libraryRejected'
    | 'staffApproved'
    | 'staffRejected'
    | 'deanApproved'
    | 'deanRejected'
    | 'registrationApproved'
    | 'registrationRejected'
    | 'chancellorApproved'
    | 'chancellorRejected'
    | 'completed';

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  reason: string;
}
