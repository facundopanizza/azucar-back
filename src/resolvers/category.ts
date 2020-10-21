import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Int,
} from 'type-graphql';
import { Category } from '../entities/Category';
import { validateBrandAndCategory } from '../validations/validateBrandAndCategory';
import { getConnection } from 'typeorm';
import FieldError from '../utils/fieldErrors';

@ObjectType()
class CategoryResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Category, { nullable: true })
  category?: Category;
}

@Resolver()
export class CategoryResolver {
  @Query(() => [Category])
  categories() {
    return Category.find();
  }

  @Query(() => Category, { nullable: true })
  category(@Arg('id', () => Int) id: number): Promise<Category | undefined> {
    return Category.findOne(id);
  }

  @Mutation(() => CategoryResponse)
  async createCategory(@Arg('title') title: string) {
    const errors = validateBrandAndCategory(title);

    if (errors) {
      return errors;
    }

    const category = await Category.create({ title }).save();

    return { category };
  }

  @Mutation(() => CategoryResponse)
  async editCategory(
    @Arg('id', () => Int) id: number,
    @Arg('title') title: string
  ) {
    const errors = validateBrandAndCategory(title);

    if (errors) {
      return errors;
    }

    const result = await getConnection()
      .createQueryBuilder()
      .update(Category)
      .set({ title })
      .where('id = :id', { id })
      .returning('*')
      .execute();

    return { category: result.raw[0] };
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Arg('id', () => Int) id: number) {
    await Category.delete(id);
    return true;
  }
}
