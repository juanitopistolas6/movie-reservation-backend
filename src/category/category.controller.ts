import { Body, Controller, Post } from '@nestjs/common'
import { CategoryService } from './category.service'
import { Authorization } from 'src/auth/decorators/authorize'
import { TypeUser } from 'src/users/interfaces'
import { CategoryDto } from './dto'

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  @Authorization(TypeUser.ADMIN)
  async createCategory(@Body() category: CategoryDto) {
    const { category: name } = category

    return this.categoryService.newCategory(name)
  }
}
