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
exports.CategoryResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Category_1 = require("../entities/Category");
const validateBrandAndCategory_1 = require("../validations/validateBrandAndCategory");
const typeorm_1 = require("typeorm");
const fieldErrors_1 = __importDefault(require("../utils/fieldErrors"));
let CategoryResponse = class CategoryResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [fieldErrors_1.default], { nullable: true }),
    __metadata("design:type", Array)
], CategoryResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Category_1.Category, { nullable: true }),
    __metadata("design:type", Category_1.Category)
], CategoryResponse.prototype, "category", void 0);
CategoryResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], CategoryResponse);
let CategoryResolver = class CategoryResolver {
    categories() {
        return Category_1.Category.find();
    }
    category(id) {
        return Category_1.Category.findOne(id);
    }
    createCategory(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, validateBrandAndCategory_1.validateBrandAndCategory)(title);
            if (errors) {
                return errors;
            }
            const category = yield Category_1.Category.create({ title }).save();
            return { category };
        });
    }
    editCategory(id, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, validateBrandAndCategory_1.validateBrandAndCategory)(title);
            if (errors) {
                return errors;
            }
            const result = yield (0, typeorm_1.getConnection)()
                .createQueryBuilder()
                .update(Category_1.Category)
                .set({ title })
                .where('id = :id', { id })
                .returning('*')
                .execute();
            return { category: result.raw[0] };
        });
    }
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Category_1.Category.delete(id);
            return true;
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Category_1.Category]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoryResolver.prototype, "categories", null);
__decorate([
    (0, type_graphql_1.Query)(() => Category_1.Category, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "category", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => CategoryResponse),
    __param(0, (0, type_graphql_1.Arg)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "createCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => CategoryResponse),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "editCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "deleteCategory", null);
CategoryResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CategoryResolver);
exports.CategoryResolver = CategoryResolver;
//# sourceMappingURL=category.js.map