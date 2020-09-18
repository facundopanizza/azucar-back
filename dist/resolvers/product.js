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
let ProductResponse = class ProductResponse {
};
__decorate([
    type_graphql_1.Field(() => [fieldErrors_1.default], { nullable: true }),
    __metadata("design:type", Array)
], ProductResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => Product_1.Product, { nullable: true }),
    __metadata("design:type", Product_1.Product)
], ProductResponse.prototype, "product", void 0);
ProductResponse = __decorate([
    type_graphql_1.ObjectType()
], ProductResponse);
let ProductResolver = class ProductResolver {
    products() {
        return Product_1.Product.find({ relations: ['brand', 'prices'] });
    }
    product(id) {
        return Product_1.Product.findOne(id);
    }
    createProduct(title, brandCode, brandId) {
        return __awaiter(this, void 0, void 0, function* () {
            const brand = yield Brand_1.Brand.findOne(brandId);
            const errors = validateProduct_1.validateProduct(title, brandCode, brand, false);
            if (errors) {
                return errors;
            }
            const product = yield Product_1.Product.create({ title, brandCode, brand }).save();
            return { product };
        });
    }
    editProduct(id, title, brandCode, brandId) {
        return __awaiter(this, void 0, void 0, function* () {
            const brand = yield Brand_1.Brand.findOne(brandId);
            const errors = validateProduct_1.validateProduct(title, brandCode, brand, true);
            if (errors) {
                return errors;
            }
            const result = yield typeorm_1.getConnection()
                .createQueryBuilder()
                .update(Product_1.Product)
                .set({ title, brandCode, brand })
                .where('id = :id', { id })
                .returning('*')
                .execute();
            return { product: result.raw[0] };
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
    type_graphql_1.Query(() => [Product_1.Product]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductResolver.prototype, "products", null);
__decorate([
    type_graphql_1.Query(() => Product_1.Product, { nullable: true }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "product", null);
__decorate([
    type_graphql_1.Mutation(() => ProductResponse),
    __param(0, type_graphql_1.Arg('title')),
    __param(1, type_graphql_1.Arg('brandCode')),
    __param(2, type_graphql_1.Arg('brandId', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "createProduct", null);
__decorate([
    type_graphql_1.Mutation(() => ProductResponse),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg('title')),
    __param(2, type_graphql_1.Arg('brandCode')),
    __param(3, type_graphql_1.Arg('brandId', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Number]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "editProduct", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "deleteProduct", null);
ProductResolver = __decorate([
    type_graphql_1.Resolver()
], ProductResolver);
exports.ProductResolver = ProductResolver;
//# sourceMappingURL=product.js.map