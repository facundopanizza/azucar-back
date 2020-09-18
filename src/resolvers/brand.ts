import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Int,
} from 'type-graphql';
import { Brand } from '../entities/Brand';
import { validateBrand } from '../validations/validateBrand';
import { getConnection } from 'typeorm';
import FieldError from '../utils/fieldErrors';

@ObjectType()
class BrandResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Brand, { nullable: true })
  brand?: Brand;
}

@Resolver()
export class BrandResolver {
  @Query(() => [Brand])
  brands() {
    return Brand.find();
  }

  @Query(() => Brand, { nullable: true })
  brand(@Arg('id', () => Int) id: number): Promise<Brand | undefined> {
    return Brand.findOne(id);
  }

  @Mutation(() => BrandResponse)
  async createBrand(@Arg('title') title: string) {
    const errors = validateBrand(title);

    if (errors) {
      return errors;
    }

    const brand = await Brand.create({ title }).save();

    return { brand };
  }

  @Mutation(() => BrandResponse)
  async editBrand(
    @Arg('id', () => Int) id: number,
    @Arg('title') title: string
  ) {
    const errors = validateBrand(title);

    if (errors) {
      return errors;
    }

    const result = await getConnection()
      .createQueryBuilder()
      .update(Brand)
      .set({ title })
      .where('id = :id', { id })
      .returning('*')
      .execute();

    return { brand: result.raw[0] };
  }

  @Mutation(() => Boolean)
  async deleteBrand(@Arg('id', () => Int) id: number) {
    await Brand.delete(id);
    return true;
  }
}
