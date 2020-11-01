import 'dotenv-safe/config';
// import cors from 'cors';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
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
  await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
//     logging: true,
//     synchronize: true,
//     migrations: [path.join(__dirname, './migrations/*')],
    entities: [Product, Brand, Size, Price, Category],
  });
  // await conn.runMigrations();

  const app = express();

//  app.use(cors({ origin: 'https://azucar.panizza.dev', credentials: true }))

  app.set('proxy', 1);
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

  apolloServer.applyMiddleware({ 
    app,
//    cors: false
  });

  app.listen(parseInt(process.env.PORT), () => {
    console.log('server started on localhost:' + process.env.PORT);
  });
})();
