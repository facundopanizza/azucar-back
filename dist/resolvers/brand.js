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
exports.BrandResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Brand_1 = require("../entities/Brand");
const validateBrand_1 = require("../validations/validateBrand");
const typeorm_1 = require("typeorm");
const fieldErrors_1 = __importDefault(require("../utils/fieldErrors"));
let BrandResponse = class BrandResponse {
};
__decorate([
    type_graphql_1.Field(() => [fieldErrors_1.default], { nullable: true }),
    __metadata("design:type", Array)
], BrandResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => Brand_1.Brand, { nullable: true }),
    __metadata("design:type", Brand_1.Brand)
], BrandResponse.prototype, "brand", void 0);
BrandResponse = __decorate([
    type_graphql_1.ObjectType()
], BrandResponse);
let BrandResolver = class BrandResolver {
    brands() {
        return Brand_1.Brand.find();
    }
    brand(id) {
        return Brand_1.Brand.findOne(id);
    }
    createBrand(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = validateBrand_1.validateBrand(title);
            if (errors) {
                return errors;
            }
            const brand = yield Brand_1.Brand.create({ title }).save();
            return { brand };
        });
    }
    editBrand(id, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = validateBrand_1.validateBrand(title);
            if (errors) {
                return errors;
            }
            const result = yield typeorm_1.getConnection()
                .createQueryBuilder()
                .update(Brand_1.Brand)
                .set({ title })
                .where('id = :id', { id })
                .returning('*')
                .execute();
            return { brand: result.raw[0] };
        });
    }
    deleteBrand(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Brand_1.Brand.delete(id);
            return true;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Brand_1.Brand]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BrandResolver.prototype, "brands", null);
__decorate([
    type_graphql_1.Query(() => Brand_1.Brand, { nullable: true }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "brand", null);
__decorate([
    type_graphql_1.Mutation(() => BrandResponse),
    __param(0, type_graphql_1.Arg('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "createBrand", null);
__decorate([
    type_graphql_1.Mutation(() => BrandResponse),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "editBrand", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "deleteBrand", null);
BrandResolver = __decorate([
    type_graphql_1.Resolver()
], BrandResolver);
exports.BrandResolver = BrandResolver;
//# sourceMappingURL=brand.js.map