"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function AuthConfig(time) {
    return {
        secret: process.env.AUTHCONFIG_SECRET,
        expiresIn: time,
    };
}
exports.default = AuthConfig;
;
