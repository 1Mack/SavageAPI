"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccountLimiter = void 0;
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.CreateAccountLimiter = (0, express_rate_limit_1.default)({
    windowMs: 30000,
    max: 20,
    message: {
        error: 'RATELIMIT: Você realizou muitas requisições, tente novamente em 30 segundos!'
    },
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
