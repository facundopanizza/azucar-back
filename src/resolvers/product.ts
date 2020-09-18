import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Int,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import FieldError from '../utils/fieldErrors';
import { Product } from '../entities/Product';
import { Brand } from '../entities/Brand';
import { validateProduct } from '../validations/validateProduct';

@ObjectType()
class ProductResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Product, { nullable: true })
  product?: Product;
}

@Resolver()
export class ProductResolver {
  @Query(() => [Product])
  products() {
    return Product.find({ relations: ['brand', 'prices'] });
  }

  @Query(() => Product, { nullable: true })
  product(@Arg('id', () => Int) id: number): Promise<Product | undefined> {
    return Product.findOne(id);
  }

  @Mutation(() => ProductResponse)
  async createProduct(
    @Arg('title') title: string,
    @Arg('brandCode') brandCode: string,
    @Arg('brandId', () => Int) brandId: number
  ) {
    const brand = await Brand.findOne(brandId);
    const errors = validateProduct(title, brandCode, brand, false);

    if (errors) {
      return errors;
    }

    const product = await Product.create({ title, brandCode, brand }).save();

    return { product };
  }

  @Mutation(() => ProductResponse)
  async editProduct(
    @Arg('id', () => Int) id: number,
    @Arg('title') title: string,
    @Arg('brandCode') brandCode: string,
    @Arg('brandId', () => Int) brandId: number
  ) {
    const brand = await Brand.findOne(brandId);
    const errors = validateProduct(title, brandCode, brand, true);

    if (errors) {
      return errors;
    }

    const result = await getConnection()
      .createQueryBuilder()
      .update(Product)
      .set({ title, brandCode, brand })
      .where('id = :id', { id })
      .returning('*')
      .execute();

    return { product: result.raw[0] };
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Arg('id', () => Int) id: number) {
    const product = await Product.findOne(id);

    if (product === undefined) {
      return false;
    }

    await Product.remove(product);
    return true;
  }
}
