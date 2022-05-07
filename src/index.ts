import cors from 'cors';
import { createConnection } from 'typeorm';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
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
import jwt from 'jsonwebtoken';

console.log(process.env);

(async () => {
  await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL as string,
//     logging: true,
    synchronize: true,
//     migrations: [path.join(__dirname, './migrations/*')],
    entities: [Product, Brand, Size, Price, Category],
  });
  // await conn.runMigrations();

  const app = express();

  app.use(cors({ origin: '*' }));

  app.use(express.json())

  app.post('/auth/login', (req, res) => {
    if (!req.body) {
      return res.status(401).send()
    }

    const body = req.body;

    if (!body.password || body.password !== process.env.PASSWORD) return res.status(401).send();


    return res.status(200).send(JSON.stringify({ accessToken: jwt.sign("user", process.env.SECRET_JWT as string)}))
  } );


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
    context: ({ req }) => {
      const token = req.headers.authorization || '';

      try {
        const user = jwt.verify(token, process.env.SECRET_JWT as string);
        if (!user) throw new AuthenticationError('you must be logged in');
      } catch (error) {
        throw new AuthenticationError('you must be logged in')
      }
    }
  });

  apolloServer.applyMiddleware({ 
    app,
  });

  app.listen(parseInt(process.env.PORT as string), () => {
    console.log('server started on localhost:' + process.env.PORT);
  });
})();
