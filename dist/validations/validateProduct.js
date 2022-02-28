"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProduct = void 0;
const validateProduct = (title, brandCode, brand, updating = false) => {
    const errors = [];
    if (title.length === 0) {
        errors.push({
            field: 'title',
            message: 'el nombre del producto tiene que tener 1 carácter o mas',
        });
    }
    if (brandCode.length === 0) {
        errors.push({
            field: 'brandCode',
            message: 'el código del producto tiene que tener 1 carácter o mas',
        });
    }
    if (brand === undefined && !updating) {
        errors.push({
            field: 'brandId',
            message: 'la marca seleccionada no existe',
        });
    }
    if (errors.length !== 0) {
        return { errors: errors };
    }
    return false;
};
exports.validateProduct = validateProduct;
//# sourceMappingURL=validateProduct.js.map