"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.ProductResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const fieldErrors_1 = __importDefault(require("../utils/fieldErrors"));
const Product_1 = require("../entities/Product");
const Brand_1 = require("../entities/Brand");
const validateProduct_1 = require("../validations/validateProduct");
const Category_1 = require("../entities/Category");
let Pagination = class Pagination {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], Pagination.prototype, "pages", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], Pagination.prototype, "offset", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], Pagination.prototype, "limit", void 0);
Pagination = __decorate([
    (0, type_graphql_1.ObjectType)()
], Pagination);
let ProductResponse = class ProductResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [fieldErrors_1.default], { nullable: true }),
    __metadata("design:type", Array)
], ProductResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Product_1.Product, { nullable: true }),
    __metadata("design:type", Product_1.Product)
], ProductResponse.prototype, "product", void 0);
ProductResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], ProductResponse);
let ProductsResponse = class ProductsResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Product_1.Product]),
    __metadata("design:type", Array)
], ProductsResponse.prototype, "products", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Pagination),
    __metadata("design:type", Pagination)
], ProductsResponse.prototype, "pagination", void 0);
ProductsResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], ProductsResponse);
let ProductResolver = class ProductResolver {
    products(term, brandId, categoryId, limit = 10, offset = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            let products;
            let pages;
            limit = limit > 30 ? 30 : limit;
            if (term || brandId || categoryId) {
                if (term) {
                    term = term.toLowerCase();
                }
                const query = [];
                if (term) {
                    query.push('(LOWER(p.title) LIKE :term OR LOWER(p.brandCode) LIKE :term)');
                }
                if (brandId) {
                    query.push('(brand.id = :brandId)');
                }
                if (categoryId) {
                    query.push('(category.id = :categoryId)');
                }
                products = yield (0, typeorm_1.getConnection)()
                    .getRepository(Product_1.Product)
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
                pages = yield (0, typeorm_1.getConnection)()
                    .getRepository(Product_1.Product)
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
            }
            else {
                products = yield Product_1.Product.find({
                    relations: ['brand', 'prices'],
                    take: limit,
                    skip: offset,
                });
                pages = yield Product_1.Product.count();
            }
            return {
                products,
                pagination: { pages: Math.ceil(pages / limit), offset, limit },
            };
        });
    }
    product(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield Product_1.Product.findOne(id, {
                relations: ['brand', 'prices', 'categories'],
            });
            return product;
        });
    }
    createProduct(title, brandCode, brandId, categoriesIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const brand = yield Brand_1.Brand.findOne(brandId);
            const errors = (0, validateProduct_1.validateProduct)(title, brandCode, brand, false);
            if (errors) {
                return errors;
            }
            let categories = yield (0, typeorm_1.getConnection)()
                .getRepository(Category_1.Category)
                .find({ where: { id: (0, typeorm_1.In)(categoriesIds) } });
            const product = yield Product_1.Product.create({
                title,
                brandCode,
                brand,
                categories,
            }).save();
            return { product };
        });
    }
    editProduct(id, title, brandCode, brandId, categoriesIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const brand = yield Brand_1.Brand.findOne(brandId);
            const errors = (0, validateProduct_1.validateProduct)(title, brandCode, brand, true);
            if (errors) {
                return errors;
            }
            let categories = yield (0, typeorm_1.getConnection)()
                .getRepository(Category_1.Category)
                .find({ where: { id: (0, typeorm_1.In)(categoriesIds) } });
            const product = yield Product_1.Product.findOneOrFail(id);
            product.title = title;
            product.brandCode = brandCode;
            product.brand = brand ? brand : product.brand;
            product.categories = categories;
            Product_1.Product.save(product);
            return { product };
        });
    }
    deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield Product_1.Product.findOne(id);
            if (product === undefined) {
                return false;
            }
            yield Product_1.Product.remove(product);
            return true;
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => ProductsResponse),
    __param(0, (0, type_graphql_1.Arg)('term', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('brandId', () => type_graphql_1.Int, { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('categoryId', () => type_graphql_1.Int, { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('limit', () => type_graphql_1.Int, { nullable: true })),
    __param(4, (0, type_graphql_1.Arg)('offset', () => type_graphql_1.Int, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "products", null);
__decorate([
    (0, type_graphql_1.Query)(() => Product_1.Product, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "product", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ProductResponse),
    __param(0, (0, type_graphql_1.Arg)('title')),
    __param(1, (0, type_graphql_1.Arg)('brandCode')),
    __param(2, (0, type_graphql_1.Arg)('brandId', () => type_graphql_1.Int)),
    __param(3, (0, type_graphql_1.Arg)('categoriesIds', () => [type_graphql_1.Int])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Array]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "createProduct", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ProductResponse),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('title')),
    __param(2, (0, type_graphql_1.Arg)('brandCode')),
    __param(3, (0, type_graphql_1.Arg)('brandId', () => type_graphql_1.Int)),
    __param(4, (0, type_graphql_1.Arg)('categoriesIds', () => [type_graphql_1.Int])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Number, Array]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "editProduct", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "deleteProduct", null);
ProductResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ProductResolver);
exports.ProductResolver = ProductResolver;
//# sourceMappingURL=product.js.map