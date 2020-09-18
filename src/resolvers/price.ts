import { Product } from '../entities/Product';
import { validatePrice } from '../validations/validatePrice';
import {
  Arg,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Price } from '../entities/Price';
import FieldError from '../utils/fieldErrors';

@ObjectType()
class PriceResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Price, { nullable: true })
  price?: Price;
}

@Resolver()
export class PriceResolver {
  @Query(() => [Price])
  prices() {
    return Price.find();
  }

  @Query(() => Price, { nullable: true })
  price(@Arg('id', () => Int) id: number): Promise<Price | undefined> {
    return Price.findOne(id);
  }

  @Mutation(() => PriceResponse)
  async createPrice(
    @Arg('amount') amount: number,
    @Arg('size') size: string,
    @Arg('productId', () => Int) productId: number
  ) {
    const product = await Product.findOne(productId);
    const errors = validatePrice(amount, size, product);

    if (errors) {
      return errors;
    }

    const price = await Price.create({
      amount,
      size: size.toUpperCase(),
      product,
    }).save();
    return { price };
  }

  @Mutation(() => PriceResponse)
  async editPrice(
    @Arg('id', () => Int) id: number,
    @Arg('amount') amount: number,
    @Arg('size') size: string
  ) {
    const errors = validatePrice(amount, size);

    if (errors) {
      return errors;
    }

    const result = await getConnection()
      .createQueryBuilder()
      .update(Price)
      .set({ amount, size: size.toUpperCase() })
      .where('id = :id', { id })
      .returning('*')
      .execute();

    return { price: result.raw[0] };
  }

  @Mutation(() => Boolean)
  async deletePrice(@Arg('id', () => Int) id: number) {
    await Price.delete(id);
    return true;
  }
}
