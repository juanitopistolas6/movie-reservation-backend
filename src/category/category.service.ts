import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from './entities/category.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async newCategory(name: string) {
    try {
      const category = this.categoryRepository.create({ name })

      return this.categoryRepository.save(category)
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }
}
