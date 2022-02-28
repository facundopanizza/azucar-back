"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv-safe/config");
const cors_1 = __importDefault(require("cors"));
const typeorm_1 = require("typeorm");
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const type_graphql_1 = require("type-graphql");
const brand_1 = require("./resolvers/brand");
const Brand_1 = require("./entities/Brand");
const Size_1 = require("./entities/Size");
const size_1 = require("./resolvers/size");
const Product_1 = require("./entities/Product");
const Price_1 = require("./entities/Price");
const product_1 = require("./resolvers/product");
const price_1 = require("./resolvers/price");
const Category_1 = require("./entities/Category");
const category_1 = require("./resolvers/category");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, typeorm_1.createConnection)({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: true,
        entities: [Product_1.Product, Brand_1.Brand, Size_1.Size, Price_1.Price, Category_1.Category],
    });
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({ origin: '*' }));
    app.use(express_1.default.json());
    app.post('/auth/login', (req, res) => {
        if (!req.body) {
            return res.status(401).send();
        }
        const body = req.body;
        if (!body.password || body.password !== process.env.PASSWORD)
            return res.status(401).send();
        return res.status(200).send(JSON.stringify({ accessToken: jsonwebtoken_1.default.sign("user", process.env.SECRET_JWT) }));
    });
    app.set('proxy', 1);
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield (0, type_graphql_1.buildSchema)({
            resolvers: [
                product_1.ProductResolver,
                brand_1.BrandResolver,
                size_1.SizeResolver,
                price_1.PriceResolver,
                category_1.CategoryResolver,
            ],
            validate: false,
        }),
        context: ({ req }) => {
            const token = req.headers.authorization || '';
            try {
                const user = jsonwebtoken_1.default.verify(token, process.env.SECRET_JWT);
                if (!user)
                    throw new apollo_server_express_1.AuthenticationError('you must be logged in');
            }
            catch (error) {
                throw new apollo_server_express_1.AuthenticationError('you must be logged in');
            }
        }
    });
    apolloServer.applyMiddleware({
        app,
    });
    app.listen(parseInt(process.env.PORT), () => {
        console.log('server started on localhost:' + process.env.PORT);
    });
}))();
//# sourceMappingURL=index.js.map