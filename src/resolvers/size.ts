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
import { Size } from '../entities/Size';
import { validateSize } from '../validations/validateSize';
import FieldError from '../utils/fieldErrors';

@ObjectType()
class SizeResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Size, { nullable: true })
  size?: Size;
}

@Resolver()
export class SizeResolver {
  @Query(() => [Size])
  sizes() {
    return Size.find();
  }

  @Query(() => Size, { nullable: true })
  size(@Arg('id', () => Int) id: number): Promise<Size | undefined> {
    return Size.findOne(id);
  }

  @Mutation(() => SizeResponse)
  async createSize(@Arg('title') title: string) {
    const errors = validateSize(title);

    if (errors) {
      return errors;
    }

    const size = await Size.create({ title: title.toUpperCase() }).save();

    return { size };
  }

  @Mutation(() => SizeResponse)
  async editSize(
    @Arg('id', () => Int) id: number,
    @Arg('title') title: string
  ) {
    const errors = validateSize(title);

    if (errors) {
      return errors;
    }

    const result = await getConnection()
      .createQueryBuilder()
      .update(Size)
      .set({ title: title.toUpperCase() })
      .where('id = :id', { id })
      .returning('*')
      .execute();

    return { size: result.raw[0] };
  }

  @Mutation(() => Boolean)
  async deleteSize(@Arg('id', () => Int) id: number) {
    await Size.delete(id);
    return true;
  }
}
