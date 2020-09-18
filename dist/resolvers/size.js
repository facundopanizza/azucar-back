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
exports.SizeResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Size_1 = require("../entities/Size");
const validateSize_1 = require("../validations/validateSize");
const fieldErrors_1 = __importDefault(require("../utils/fieldErrors"));
let SizeResponse = class SizeResponse {
};
__decorate([
    type_graphql_1.Field(() => [fieldErrors_1.default], { nullable: true }),
    __metadata("design:type", Array)
], SizeResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => Size_1.Size, { nullable: true }),
    __metadata("design:type", Size_1.Size)
], SizeResponse.prototype, "size", void 0);
SizeResponse = __decorate([
    type_graphql_1.ObjectType()
], SizeResponse);
let SizeResolver = class SizeResolver {
    sizes() {
        return Size_1.Size.find();
    }
    size(id) {
        return Size_1.Size.findOne(id);
    }
    createSize(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = validateSize_1.validateSize(title);
            if (errors) {
                return errors;
            }
            const size = yield Size_1.Size.create({ title: title.toUpperCase() }).save();
            return { size };
        });
    }
    editSize(id, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = validateSize_1.validateSize(title);
            if (errors) {
                return errors;
            }
            const result = yield typeorm_1.getConnection()
                .createQueryBuilder()
                .update(Size_1.Size)
                .set({ title: title.toUpperCase() })
                .where('id = :id', { id })
                .returning('*')
                .execute();
            return { size: result.raw[0] };
        });
    }
    deleteSize(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Size_1.Size.delete(id);
            return true;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Size_1.Size]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SizeResolver.prototype, "sizes", null);
__decorate([
    type_graphql_1.Query(() => Size_1.Size, { nullable: true }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SizeResolver.prototype, "size", null);
__decorate([
    type_graphql_1.Mutation(() => SizeResponse),
    __param(0, type_graphql_1.Arg('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SizeResolver.prototype, "createSize", null);
__decorate([
    type_graphql_1.Mutation(() => SizeResponse),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], SizeResolver.prototype, "editSize", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SizeResolver.prototype, "deleteSize", null);
SizeResolver = __decorate([
    type_graphql_1.Resolver()
], SizeResolver);
exports.SizeResolver = SizeResolver;
//# sourceMappingURL=size.js.map