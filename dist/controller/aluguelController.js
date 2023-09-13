"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AluguelController = void 0;
var axios_1 = __importDefault(require("axios"));
var AppError_1 = __importDefault(require("../errors/AppError"));
var database_1 = require("../database");
var functions_1 = __importDefault(require("../functions"));
var AluguelController = /** @class */ (function () {
    function AluguelController(request) {
        this.request = request;
    }
    AluguelController.prototype.setCommands = function (_a) {
        var commands = _a.commands;
        return __awaiter(this, void 0, void 0, function () {
            var erros;
            var _this = this;
            return __generator(this, function (_b) {
                if (!commands || commands.length == 0)
                    throw new AppError_1.default('API errada, forma correta do body /{commands: {["comando1", "comando2"]}} ----- Exemplo: {commands: {["sm_map dust2"]}}');
                erros = [];
                commands.map(function (command) {
                    var _a;
                    if (typeof command == 'number')
                        return erros.push("Comando /".concat(command, "/ tem que ser string!"));
                    try {
                        axios_1.default.post("https://panel.mjsv.us/api/client/servers/".concat((_a = _this.request.user) === null || _a === void 0 ? void 0 : _a.identifier, "/command"), { "command": command }, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'Authorization': "Bearer ".concat(process.env.PANEL_API_KEY),
                            }
                        });
                    }
                    catch (error) {
                        erros.push("Erro ao Executar o comando /".concat(command, "/"));
                    }
                });
                if (erros.length == commands.length)
                    throw new AppError_1.default(erros.join(" | "));
                return [2 /*return*/, __assign({ message: "Comandos executados com sucesso: ".concat(commands.filter(function (m) { return erros.length > 0 ? erros.some(function (err) { return !err.includes(m); }) : m; }).join(" | ")) }, erros.length > 0 && { error: erros.join(" | ") })];
            });
        });
    };
    AluguelController.prototype.setPower = function (_a) {
        var _b;
        var power = _a.power;
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!power || !['restart', 'start', 'stop', 'kill'].includes(power))
                            throw new AppError_1.default('Você fornecer a propriedade /body/, passando /"restart","start","stop" ou "kill"');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.post("https://panel.mjsv.us/api/client/servers/".concat((_b = this.request.user) === null || _b === void 0 ? void 0 : _b.identifier, "/power"), { signal: power }, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                    'Authorization': "Bearer ".concat(process.env.PANEL_API_KEY),
                                }
                            })];
                    case 2:
                        response = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _c.sent();
                        throw new AppError_1.default('Erro ao executar a ação no servidor');
                    case 4:
                        if (!response)
                            throw new AppError_1.default('Erro ao executar a ação no servidor');
                        return [2 /*return*/, 'Comando de energia executado com sucesso...espere uns segundos até que o servidor termine de executar o comando!'];
                }
            });
        });
    };
    AluguelController.prototype.getMatchInfos = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, new database_1.Database().query("SELECT * FROM rankme_".concat((_a = this.request.user) === null || _a === void 0 ? void 0 : _a.server_id))];
                    case 1:
                        response = _b.sent();
                        if (response.length == 0)
                            throw new AppError_1.default('Nenhuma informação encontrada');
                        return [2 /*return*/, response];
                    case 2:
                        error_2 = _b.sent();
                        throw new AppError_1.default('Error ao buscar informações do rank no servidor');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AluguelController.prototype.deleteMatchInfos = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, new database_1.Database().query("DELETE FROM rankme_".concat((_a = this.request.user) === null || _a === void 0 ? void 0 : _a.server_id))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_3 = _b.sent();
                        throw new AppError_1.default('Error ao buscar informações do rank no servidor');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AluguelController.prototype.getDemos = function (_a) {
        var _b;
        var maxDemos = _a.maxDemos;
        return __awaiter(this, void 0, void 0, function () {
            var data, err_1;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (maxDemos && maxDemos.match(/[^0-9]/g))
                            throw new AppError_1.default('Ao fornecer o /maxDemos/, forneça-o como número inteiro!');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, axios_1.default.get("https://panel.mjsv.us/api/client/servers/".concat((_b = this.request.user) === null || _b === void 0 ? void 0 : _b.identifier, "/files/list?directory=%2Fcsgo%2Fwarmod"), {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                    'Authorization': "Bearer ".concat(process.env.PANEL_API_KEY),
                                }
                            })];
                    case 2:
                        data = (_c.sent()).data;
                        data = data.data.filter(function (m) { return m.attributes.name.endsWith('.dem'); }).slice(0, maxDemos || 1);
                        if (data.length == 0)
                            throw new AppError_1.default('Nenhuma demo encontrada!');
                        return [4 /*yield*/, Promise.all(data.map(function (d) { return __awaiter(_this, void 0, void 0, function () {
                                var result;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, axios_1.default.get("https://panel.mjsv.us/api/client/servers/".concat((_a = this.request.user) === null || _a === void 0 ? void 0 : _a.identifier, "/files/download?file=%2Fcsgo%2Fwarmod%2F").concat(d.attributes.name), {
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Accept': 'application/json',
                                                    'Authorization': "Bearer ".concat(process.env.PANEL_API_KEY),
                                                }
                                            })];
                                        case 1:
                                            result = _b.sent();
                                            result = result.data;
                                            return [2 /*return*/, { url: result.attributes.url, name: d.attributes.name, size: d.attributes.size, created_at: d.attributes.modified_at }];
                                    }
                                });
                            }); }))];
                    case 3:
                        data = _c.sent();
                        return [2 /*return*/, data];
                    case 4:
                        err_1 = _c.sent();
                        if (err_1 instanceof AppError_1.default)
                            throw new AppError_1.default(err_1.message);
                        throw new AppError_1.default('Erro ao buscar as demos');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AluguelController.prototype.getConfigurations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var functions, admins, password, tk;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        functions = new functions_1.default(this.request);
                        return [4 /*yield*/, functions.getAdmins()];
                    case 1:
                        admins = _a.sent();
                        return [4 /*yield*/, functions.getPassword(true)];
                    case 2:
                        password = _a.sent();
                        return [4 /*yield*/, functions.getTk(true)];
                    case 3:
                        tk = _a.sent();
                        return [2 /*return*/, [
                                { property: 'admin', result: admins },
                                { property: 'password', result: password },
                                { property: 'tk', result: tk },
                            ]];
                }
            });
        });
    };
    AluguelController.prototype.setConfigurations = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var allowedProperties, functions, executed;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (Object.keys(body).length == 0)
                            throw new AppError_1.default('Você deve fornecer ao menos uma propriedade!');
                        allowedProperties = ['password', 'admin', 'tk'];
                        if (Object.keys(body).map(function (m) { return allowedProperties.find(function (a) { return a == m; }) ? 1 : 0; }).find(function (m) { return m == 0; }) == 0)
                            throw new AppError_1.default("Voc\u00EA forneceu alguma propriedade errada! As aceitas s\u00E3o: /".concat(allowedProperties.join(', '), "/"));
                        functions = new functions_1.default(this.request);
                        executed = [];
                        return [4 /*yield*/, Promise.all(Object.keys(body).map(function (property) { return __awaiter(_this, void 0, void 0, function () {
                                var result;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, functions["set".concat(property.charAt(0).toUpperCase()).concat(property.slice(1))](body[property])];
                                        case 1:
                                            result = _a.sent();
                                            executed.push({ result: result, property: property });
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, executed];
                }
            });
        });
    };
    return AluguelController;
}());
exports.AluguelController = AluguelController;
