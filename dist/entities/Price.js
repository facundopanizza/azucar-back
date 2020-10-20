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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Price = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Product_1 = require("./Product");
let Price = class Price extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Price.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float),
    typeorm_1.Column({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Price.prototype, "amount", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Price.prototype, "size", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Product_1.Product, (product) => product.prices, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Product_1.Product)
], Price.prototype, "product", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Price.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Price.prototype, "updatedAt", void 0);
Price = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], Price);
exports.Price = Price;
//# sourceMappingURL=Price.js.map