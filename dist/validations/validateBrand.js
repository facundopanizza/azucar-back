"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAndCategory = void 0;
exports.validateAndCategory = (title) => {
    const errors = [];
    if (title.length === 0) {
        errors.push({
            field: 'title',
            message: 'el titulo tiene que tener 1 carácter o mas',
        });
    }
    if (errors.length !== 0) {
        return { errors: errors };
    }
    return false;
};
//# sourceMappingURL=validateBrand.js.map