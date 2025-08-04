import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { CreateCampusDto } from './dto/create-campus.dto';
import { Sequelize } from 'sequelize-typescript';
import { Campus } from './entities/campus.entity';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Faculty } from './entities/faculity.entity';
import { CreateFacultyDto } from './dto/create-faculity.dto';
import { UpdateFacultyDto } from './dto/update-faculity.dto';

@Injectable()
export class SettingsService {
  constructor(
    private readonly sequelize: Sequelize
  ) { }

  private get campusRepository() {
    return this.sequelize.getRepository(Campus)
  }

  async create(createCampusDto: CreateCampusDto) {
    try {
      return await this.campusRepository.create({ ...createCampusDto } as Campus);
    } catch (error) {
      throw new Error(`Failed to create campus: ${error.message}`);
    }
  }

  async findAllCampus() {
    try {
      return await this.campusRepository.findAll({

        order
          : [['createdAt', 'DESC']]
      });
    } catch (error) {
      throw new Error(`Failed to fetch campuses: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const campus = await this.campusRepository.findByPk(id);
      if (!campus) {
        throw new Error(`Campus with ID ${id} not found`);
      }
      return campus;
    } catch (error) {
      throw new Error(`Failed to fetch campus: ${error.message}`);
    }
  }

  async update(id: number, updateCampusDto: UpdateCampusDto) {
    try {
      const [affectedCount] = await this.campusRepository.update(updateCampusDto, {
        where: { id: id }
      });

      if (affectedCount === 0) {
        throw new Error(`Campus with ID ${id} not found`);
      }

      return this.findOne(id);
    } catch (error) {
      throw new Error(`Failed to update campus: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const campus = await this.findOne(id);
      await this.campusRepository.destroy({
        where: { id }
      });
      return `Campus with id ${id} was successfully removed`;
    } catch (error) {
      throw new Error(`Failed to remove campus: ${error.message}`);
    }
  }

  // faculty service
  private get FacultyRepository() {
    return this.sequelize.getRepository(Faculty)
  }

  async createfaculty(createFacultyDto: CreateFacultyDto) {
    try {
      const existingCampus = await this.campusRepository.findByPk(createFacultyDto.campusId)
      if (!existingCampus) {
        throw new BadRequestException(`Campus Id does not exist`)
      }
      return await this.FacultyRepository.create({ ...createFacultyDto } as Faculty);
    } catch (error) {
      throw new BadRequestException(`Failed to create Faculty: ${error.message}`);
    }
  }


  async findAllFaculties(campusId?: string) {
    const whereCondition = campusId ? { campusId } : {};

    return this.FacultyRepository.findAll({
      where: whereCondition,
      include: [
        { model: this.sequelize.model('Campus'), attributes: ['id', 'name'] }
      ],
      order
        : [['createdAt', 'DESC']]
      // Add other options like relations, order, etc.
    });
  }

  async findOneFaculty(id: number) {
    try {
      const Faculty = await this.FacultyRepository.findByPk(id, {
        include: [
          { model: this.sequelize.model('Campus'), attributes: ['id', 'name'] }
        ]
      });
      if (!Faculty) {
        throw new Error(`Faculty with ID ${id} not found`);
      }
      return Faculty;
    } catch (error) {
      throw new Error(`Failed to fetch Faculty: ${error.message}`);
    }
  }

  async updateFaculty(id: number, updateFacultyDto: UpdateFacultyDto) {
    try {
      const [affectedCount] = await this.FacultyRepository.update(updateFacultyDto, {
        where: { id: id }
      });

      if (affectedCount === 0) {
        throw new Error(`Faculty with ID ${id} not found`);
      }

      return this.findOne(id);
    } catch (error) {
      throw new Error(`Failed to update Faculty: ${error.message}`);
    }
  }

  async removeFaculty(id: number) {
    try {
      const Faculty = await this.findOne(id);
      await this.FacultyRepository.destroy({
        where: { id }
      });
      return `Faculty with id ${id} was successfully removed`;
    } catch (error) {
      throw new Error(`Failed to remove Faculty: ${error.message}`);
    }
  }

  //department sevice
  private get DepartmentRepository() {
    return this.sequelize.getRepository(Department)
  }

  async createDepartment(createDepartmentDto: CreateDepartmentDto) {
    try {
      const existingSchool = await this.FacultyRepository.findByPk(createDepartmentDto.facultyId)
      if (!existingSchool) {
        throw new BadRequestException(`School Id does not exist`)
      }
      return await this.DepartmentRepository.create({ ...createDepartmentDto } as Department);
    } catch (error) {
      throw new BadRequestException(`Failed to create Department: ${error.message}`);
    }
  }


  async findAllDepartment(facultyId?: string) {
    const whereCondition = facultyId ? { facultyId } : {};

    return this.DepartmentRepository.findAll({
      where: whereCondition,
      order
        : [['createdAt', 'DESC']]
      // Add other options like relations, order, etc.
    });
  }
  async findOneDepartment(id: number) {
    try {
      const Department = await this.DepartmentRepository.findByPk(id, {
        include: [
          { model: this.sequelize.model('School'), attributes: ['id', 'name'] }
        ]
      });
      if (!Department) {
        throw new Error(`Department with ID ${id} not found`);
      }
      return Department;
    } catch (error) {
      throw new Error(`Failed to fetch Department: ${error.message}`);
    }
  }

  async updateDepartment(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    try {
      const [affectedCount] = await this.DepartmentRepository.update(updateDepartmentDto, {
        where: { id: id }
      });

      if (affectedCount === 0) {
        throw new Error(`Department with ID ${id} not found`);
      }

      return this.findOne(id);
    } catch (error) {
      throw new Error(`Failed to update Department: ${error.message}`);
    }
  }

  async removeDepartment(id: number) {
    try {
      const Department = await this.findOne(id);
      await this.DepartmentRepository.destroy({
        where: { id }
      });
      return `Department with id ${id} was successfully removed`;
    } catch (error) {
      throw new Error(`Failed to remove Department: ${error.message}`);
    }
  }

}
