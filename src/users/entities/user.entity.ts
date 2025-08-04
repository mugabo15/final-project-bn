// user.model.ts
import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Campus } from 'src/settings/entities/campus.entity';
import { Department } from 'src/settings/entities/department.entity';
import { Faculty } from 'src/settings/entities/faculity.entity';

// Define the UserRole type
export type UserRole =
  | 'student'
  | 'staff'
  | 'dean'
  | 'hod'
  | 'director_of_languages'
  | 'librarian'
  | 'finance'
  | 'registrationOfficer'
  | 'recoveryOfficer'
  | 'admin'
  | 'chancellor';


// Optional: Enum version for strict typing
export enum StaffRole {
  STUDENT = 'student',
  STAFF = 'staff',
  DEAN = 'dean',
  HOD = 'hod',
  DIRECTOR_OF_LANGUAGES = 'director_of_languages',
  LIBRARIAN = 'librarian',
  FINANCE = 'finance',
  REGISTRATION_OFFICER = 'registrationOfficer',
  RECOVERY_OFFICER = 'recoveryOfficer',
  ADMIN = 'admin',
  CHANCELLOR = 'chancellor',
}

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @Column({
    type: DataType.STRING(50),
    unique: true,
    allowNull: true,
  })
  regNumber: string; // for student

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  registrationDate: Date;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  firstName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  lastName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  fatherName: string; // for student

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  motherName: string; // for student

  @Column({
    type: DataType.ENUM('male', 'female'),
    allowNull: true,
  })
  gender: 'male' | 'female';

  @Column({
    type: DataType.STRING(30),
    allowNull: true,
  })
  idCardNumber: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  nationality: string; // for student

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  dateOfBirth: Date; // for student

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.ENUM(
      'student',
      'staff',
      'dean',
      'hod',
      'director_of_languages',
      'librarian',
      'finance',
      'registrationOfficer',
      'recoveryOfficer',
      'admin',
      'chancellor'
    ),
    allowNull: true,
  })
  roles: UserRole;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  staffPosition: string; // e.g., 'Lecturer', 'Dean', etc.

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  level: string; // for student (e.g., Year 1, 2...)

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  program: string; // for student (day, evening, weekend)

  @ForeignKey(() => Campus)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  campusId: number;

  @ForeignKey(() => Faculty)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  facultyId: number;

  @ForeignKey(() => Department)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  departmentId: number;

  @Column({
    type: DataType.STRING(225),
    allowNull: true,
  })
  signature: string;

  @BelongsTo(() => Campus)
  campus: Campus;

  @BelongsTo(() => Faculty)
  faculty: Faculty;

  @BelongsTo(() => Department)
  department: Department;
}
