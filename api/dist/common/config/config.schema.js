"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigValidationSchema = void 0;
const zod_1 = require("zod");
exports.ConfigValidationSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().url(),
    REDIS_URL: zod_1.z.string().url(),
    PORT: zod_1.z.coerce.number().default(8080),
    JWT_SECRET: zod_1.z.string().min(10),
    JWT_REFRESH_SECRET: zod_1.z.string().min(10),
    FRONTEND_URL: zod_1.z.string().url(),
});
//# sourceMappingURL=config.schema.js.map