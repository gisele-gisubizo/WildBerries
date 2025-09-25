"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = exports.validate = void 0;
const zod_1 = require("zod");
const errors_1 = require("../utilis/errors");
// Middleware to validate request data against a Zod schema
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (e) {
            if (e instanceof zod_1.ZodError) {
                const errors = {};
                e.issues.forEach((issue) => {
                    const path = issue.path.join(".");
                    if (!errors[path])
                        errors[path] = [];
                    errors[path].push(issue.message);
                });
                return next(new errors_1.ValidationError(errors));
            }
            return next(e);
        }
    };
};
exports.validate = validate;
// Function to validate arbitrary data
const validateData = (schema, data) => {
    try {
        return schema.parse(data);
    }
    catch (e) {
        if (e instanceof zod_1.ZodError) {
            const errors = {};
            e.issues.forEach((issue) => {
                const path = issue.path.join(".");
                if (!errors[path])
                    errors[path] = [];
                errors[path].push(issue.message);
            });
            throw new errors_1.ValidationError(errors);
        }
        throw e;
    }
};
exports.validateData = validateData;
