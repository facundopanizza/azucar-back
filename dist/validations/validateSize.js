"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSize = void 0;
const validateSize = (title) => {
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
exports.validateSize = validateSize;
//# sourceMappingURL=validateSize.js.map