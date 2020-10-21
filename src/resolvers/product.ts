import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Int,
} from 'type-graphql';
import { getConnection, In } from 'typeorm';
import FieldError from '../utils/fieldErrors';
import { Product } from '../entities/Product';
import { Brand } from '../entities/Brand';
import { validateProduct } from '../validations/validateProduct';
import { Category } from '../entities/Category';

@ObjectType()
class Pagination {
  @Field(() => Int)
  pages: number;

  @Field(() => Int)
  offset: number;

  @Field(() => Int)
  limit: number;
}

@ObjectType()
class ProductResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Product, { nullable: true })
  product?: Product;
}

@ObjectType()
class ProductsResponse {
  @Field(() => [Product])
  products: Product[];

  @Field(() => Pagination)
  pagination: Pagination;
}

@Resolver()
export class ProductResolver {
  @Query(() => ProductsResponse)
  async products(
    @Arg('term', { nullable: true }) term?: string,
    @Arg('brandId', () => Int, { nullable: true }) brandId?: number,
    @Arg('categoryId', () => Int, { nullable: true }) categoryId?: number,
    @Arg('limit', () => Int, { nullable: true }) limit: number = 10,
    @Arg('offset', () => Int, { nullable: true }) offset: number = 0
  ) {
    let products: Product[];
    let pages: number;
    limit = limit > 30 ? 30 : limit;

    if (term || brandId || categoryId) {
      if (term) {
        term = term.toLowerCase();
      }

      const query = [];

      if (term) {
        query.push(
          '(LOWER(p.title) LIKE :term OR LOWER(p.brandCode) LIKE :term)'
        );
      }

      if (brandId) {
        query.push('(brand.id = :brandId)');
      }

      if (categoryId) {
        query.push('(category.id = :categoryId)');
      }

      products = await getConnection()
        .getRepository(Product)
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.brand', 'brand')
        .leftJoinAndSelect('p.prices', 'price')
        .leftJoinAndSelect('p.categories', 'category')
        .where(query.length === 0 ? query[0] : query.join(' AND '), {
          brandId,
          term: `%${term}%`,
          categoryId,
        })
        .take(limit)
        .skip(offset)
        .getMany();

      pages = await getConnection()
        .getRepository(Product)
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.brand', 'brand')
        .leftJoinAndSelect('p.prices', 'price')
        .leftJoinAndSelect('p.categories', 'category')
        .where(query.length === 0 ? query[0] : query.join(' AND '), {
          brandId,
          term: `%${term}%`,
          categoryId,
        })
        .getCount();
    } else {
      products = await Product.find({
        relations: ['brand', 'prices'],
        take: limit,
        skip: offset,
      });

      pages = await Product.count();
    }

    return {
      products,
      pagination: { pages: Math.ceil(pages / limit), offset, limit },
    };
  }

  @Query(() => Product, { nullable: true })
  async product(
    @Arg('id', () => Int) id: number
  ): Promise<Product | undefined> {
    const product = await Product.findOne(id, {
      relations: ['brand', 'prices', 'categories'],
    });
    return product;
  }

  @Mutation(() => ProductResponse)
  async createProduct(
    @Arg('title') title: string,
    @Arg('brandCode') brandCode: string,
    @Arg('brandId', () => Int) brandId: number,
    @Arg('categoriesIds', () => [Int]) categoriesIds: number[]
  ) {
    const brand = await Brand.findOne(brandId);
    const errors = validateProduct(title, brandCode, brand, false);

    if (errors) {
      return errors;
    }

    let categories = await getConnection()
      .getRepository(Category)
      .find({ where: { id: In(categoriesIds) } });

    const product = await Product.create({
      title,
      brandCode,
      brand,
      categories,
    }).save();

    return { product };
  }

  @Mutation(() => ProductResponse)
  async editProduct(
    @Arg('id', () => Int) id: number,
    @Arg('title') title: string,
    @Arg('brandCode') brandCode: string,
    @Arg('brandId', () => Int) brandId: number,
    @Arg('categoriesIds', () => [Int]) categoriesIds: number[]
  ) {
    const brand = await Brand.findOne(brandId);
    const errors = validateProduct(title, brandCode, brand, true);

    if (errors) {
      return errors;
    }

    let categories = await getConnection()
      .getRepository(Category)
      .find({ where: { id: In(categoriesIds) } });

    const product = await Product.findOneOrFail(id);

    product.title = title;
    product.brandCode = brandCode;
    product.brand = brand ? brand : product.brand;
    product.categories = categories;

    Product.save(product);

    return { product };
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
