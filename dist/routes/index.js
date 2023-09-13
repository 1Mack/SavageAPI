"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var aluguel_routes_1 = __importDefault(require("./aluguel.routes"));
var servers_routes_1 = __importDefault(require("./servers.routes"));
var utilidades_routes_1 = __importDefault(require("./utilidades.routes"));
var routes = (0, express_1.Router)();
routes.use('/aluguel', aluguel_routes_1.default);
routes.use('/servers', servers_routes_1.default);
routes.use('/utilidades', utilidades_routes_1.default);
exports.default = routes;
