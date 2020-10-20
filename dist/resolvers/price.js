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
exports.PriceResolver = void 0;
const Product_1 = require("../entities/Product");
const validatePrice_1 = require("../validations/validatePrice");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Price_1 = require("../entities/Price");
const fieldErrors_1 = __importDefault(require("../utils/fieldErrors"));
let PriceResponse = class PriceResponse {
};
__decorate([
    type_graphql_1.Field(() => [fieldErrors_1.default], { nullable: true }),
    __metadata("design:type", Array)
], PriceResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => Price_1.Price, { nullable: true }),
    __metadata("design:type", Price_1.Price)
], PriceResponse.prototype, "price", void 0);
PriceResponse = __decorate([
    type_graphql_1.ObjectType()
], PriceResponse);
let PriceResolver = class PriceResolver {
    prices() {
        return __awaiter(this, void 0, void 0, function* () {
            return Price_1.Price.find();
        });
    }
    price(id) {
        return Price_1.Price.findOne(id);
    }
    createPrice(amount, size, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield Product_1.Product.findOne(productId);
            const errors = validatePrice_1.validatePrice(amount, size, product);
            if (errors) {
                return errors;
            }
            const price = yield Price_1.Price.create({
                amount,
                size: size.toUpperCase(),
                product,
            }).save();
            return { price };
        });
    }
    editPrice(id, amount, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = validatePrice_1.validatePrice(amount, size);
            if (errors) {
                return errors;
            }
            const result = yield typeorm_1.getConnection()
                .createQueryBuilder()
                .update(Price_1.Price)
                .set({ amount, size: size.toUpperCase() })
                .where('id = :id', { id })
                .returning('*')
                .execute();
            return { price: result.raw[0] };
        });
    }
    deletePrice(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Price_1.Price.delete(id);
            return true;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Price_1.Price]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PriceResolver.prototype, "prices", null);
__decorate([
    type_graphql_1.Query(() => Price_1.Price, { nullable: true }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PriceResolver.prototype, "price", null);
__decorate([
    type_graphql_1.Mutation(() => PriceResponse),
    __param(0, type_graphql_1.Arg('amount')),
    __param(1, type_graphql_1.Arg('size')),
    __param(2, type_graphql_1.Arg('productId', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number]),
    __metadata("design:returntype", Promise)
], PriceResolver.prototype, "createPrice", null);
__decorate([
    type_graphql_1.Mutation(() => PriceResponse),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg('amount')),
    __param(2, type_graphql_1.Arg('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], PriceResolver.prototype, "editPrice", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PriceResolver.prototype, "deletePrice", null);
PriceResolver = __decorate([
    type_graphql_1.Resolver()
], PriceResolver);
exports.PriceResolver = PriceResolver;
//# sourceMappingURL=price.js.map