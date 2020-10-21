import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import path from 'path';
import { buildSchema } from 'type-graphql';
import { BrandResolver } from './resolvers/brand';
import { Brand } from './entities/Brand';
import { Size } from './entities/Size';
import { SizeResolver } from './resolvers/size';
import { Product } from './entities/Product';
import { Price } from './entities/Price';
import { ProductResolver } from './resolvers/product';
import { PriceResolver } from './resolvers/price';
import { Category } from './entities/Category';
import { CategoryResolver } from './resolvers/category';

(async () => {
  const conn = await createConnection({
    type: 'postgres',
    database: 'azucar',
    host: '192.168.0.48',
    username: 'facundo',
    password: 'facundo',
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, './migrations/*')],
    entities: [Product, Brand, Size, Price, Category],
  });
  await conn.runMigrations();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        ProductResolver,
        BrandResolver,
        SizeResolver,
        PriceResolver,
        CategoryResolver,
      ],
      validate: false,
    }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('server started on localhost:4000');
  });
})();
