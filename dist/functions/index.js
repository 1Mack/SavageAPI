"use strict";
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
var database_1 = require("../database");
var memory_cache_1 = __importDefault(require("memory-cache"));
var axios_1 = __importDefault(require("axios"));
var steamid_1 = __importDefault(require("steamid"));
var moment_1 = __importDefault(require("moment"));
moment_1.default.locale('en-gb');
var Functions = /** @class */ (function () {
    function Functions(request) {
        this.user = request === null || request === void 0 ? void 0 : request.user;
    }
    Functions.prototype.getAdmins = function (steamid, reloadCache) {
        return __awaiter(this, void 0, void 0, function () {
            var findCache, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        findCache = !reloadCache && memory_cache_1.default.get("@admins:".concat(this.user.server_id));
                        if (!(!findCache || reloadCache)) return [3 /*break*/, 5];
                        result = void 0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, new database_1.Database().query("SELECT * FROM Cargos WHERE server_id = '?' ".concat(steamid ? "AND playerid = ?" : ''), [this.user.server_id, steamid ? steamid : ''])];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        return [2 /*return*/, ({ error: 'Erro ao buscar as informações' })];
                    case 4:
                        if (!result || result.length == 0)
                            return [2 /*return*/, ({ error: 'Nenhum admin encontrado' })];
                        if (steamid == undefined) {
                            memory_cache_1.default.put("@admins:".concat(this.user.server_id), result, 600000);
                        }
                        return [2 /*return*/, result];
                    case 5: return [2 /*return*/, findCache];
                }
            });
        });
    };
    Functions.prototype.getPassword = function (onlyPassword, reloadCache) {
        return __awaiter(this, void 0, void 0, function () {
            var findCache, response, error_1, index, password;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        findCache = !reloadCache && memory_cache_1.default.get("@password:".concat(this.user.server_id));
                        if (!(!findCache || reloadCache)) return [3 /*break*/, 5];
                        response = void 0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.get("https://panel.mjsv.us/api/client/servers/".concat(this.user.identifier, "/files/contents?file=%2Fcsgo%2Fcfg%2Fserver.cfg"), {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                    'Authorization': "Bearer ".concat(process.env.PANEL_API_KEY),
                                }
                            })];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, { error: 'Erro ao buscar informações no server.cfg' }];
                    case 4:
                        index = response.data.indexOf('sv_password');
                        password = response.data.substring(index, response.data.indexOf('\n', index)).split(' ');
                        memory_cache_1.default.put("@password:".concat(this.user.server_id), { completeCFG: response.data, password: password[1], index: index });
                        if (onlyPassword)
                            return [2 /*return*/, password[1]];
                        return [2 /*return*/, { completeCFG: response.data, password: password[1], index: index }];
                    case 5:
                        if (onlyPassword)
                            return [2 /*return*/, findCache.password];
                        return [2 /*return*/, findCache];
                }
            });
        });
    };
    Functions.prototype.getTk = function (onlyTk, reloadCache) {
        return __awaiter(this, void 0, void 0, function () {
            var findCache, response, error_2, index, tk;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        findCache = !reloadCache && memory_cache_1.default.get("@tk:".concat(this.user.server_id));
                        if (!(!findCache || reloadCache)) return [3 /*break*/, 5];
                        response = void 0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.get("https://panel.mjsv.us/api/client/servers/".concat(this.user.identifier, "/files/contents?file=%2Fcsgo%2Fcfg%2Fwarmod%2Fruleset_default.cfg"), {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                    'Authorization': "Bearer ".concat(process.env.PANEL_API_KEY),
                                }
                            })];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        return [2 /*return*/, ({ error: 'Erro ao buscar informações no server.cfg' })];
                    case 4:
                        index = response.data.indexOf('mp_friendlyfire');
                        tk = response.data.substring(index, response.data.indexOf('\n', index)).split(' ');
                        memory_cache_1.default.put("@tk:".concat(this.user.server_id), { completeCFG: response.data, tk: tk[1], index: index });
                        if (onlyTk)
                            return [2 /*return*/, tk[1]];
                        return [2 /*return*/, { completeCFG: response.data, tk: tk[1], index: index }];
                    case 5:
                        if (onlyTk)
                            return [2 /*return*/, findCache.tk];
                        return [2 /*return*/, findCache];
                }
            });
        });
    };
    Functions.prototype.getSteamid = function (steamURL) {
        return __awaiter(this, void 0, void 0, function () {
            function getSteamid64() {
                return __awaiter(this, void 0, void 0, function () {
                    var error_6;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, axios_1.default.get("https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=1EF908743086093E1FB911BC9BF2CCE8&vanityurl=".concat(steamURL)).then(function (_a) {
                                        var data = _a.data;
                                        return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_b) {
                                                if (data.response['message'])
                                                    return [2 /*return*/, { error: 'erro' }];
                                                return [2 /*return*/, data.response.steamid];
                                            });
                                        });
                                    })];
                            case 1: return [2 /*return*/, _a.sent()];
                            case 2:
                                error_6 = _a.sent();
                                return [2 /*return*/, { error: 'Erro no link' }];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
            var steamid64, error_3, error_4, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!steamURL)
                            return [2 /*return*/, { error: 'Você deve fornecer o parametro /steamURL/' }];
                        if (steamURL.includes('STEAM_'))
                            return [2 /*return*/, steamURL];
                        if (!((steamURL.includes('steamcommunity.com/id/') || steamURL.includes('steamcommunity.com/profiles/')) &&
                            (steamURL.includes('http') || steamURL.includes('https')))) {
                            if (!isNaN(Number(steamURL)) && Number(steamURL) > 10) {
                                try {
                                    return [2 /*return*/, new steamid_1.default(steamURL).getSteam2RenderedID(true)];
                                }
                                catch (error) {
                                    return [2 /*return*/, { error: 'Erro no Link' }];
                                }
                            }
                            else {
                                return [2 /*return*/, { error: 'Você digitou o link do seu perfil Errado' }];
                            }
                        }
                        if (steamURL.charAt(steamURL.length - 1) == '/') {
                            steamURL = steamURL.slice(0, -1);
                        }
                        steamURL = steamURL.slice(steamURL.lastIndexOf('/') + 1);
                        if (!(!isNaN(Number(steamURL)) && Number(steamURL) > 10)) return [3 /*break*/, 7];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 2, , 7]);
                        return [2 /*return*/, new steamid_1.default(steamURL).getSteam2RenderedID(true)];
                    case 2:
                        error_3 = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, getSteamid64()];
                    case 4:
                        steamid64 = _a.sent();
                        return [2 /*return*/, new steamid_1.default(steamid64).getSteam2RenderedID(true).toString()];
                    case 5:
                        error_4 = _a.sent();
                        return [2 /*return*/, { error: 'Erro no link' }];
                    case 6: return [3 /*break*/, 7];
                    case 7:
                        _a.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, getSteamid64()];
                    case 8:
                        steamid64 = _a.sent();
                        return [2 /*return*/, new steamid_1.default(steamid64).getSteam2RenderedID(true).toString()];
                    case 9:
                        error_5 = _a.sent();
                        return [2 /*return*/, { error: 'Erro no link' }];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Functions.prototype.setAdmin = function (admins) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!admins || admins.length < 1)
                            return [2 /*return*/, { error: 'Você deve passar um array sem ser vazio!' }];
                        return [4 /*yield*/, Promise.all(admins.map(function (steamid) { return __awaiter(_this, void 0, void 0, function () {
                                var oldSteamid, newSteamid, checkIfAdmin, error_7, checkIfAlreadyAdminOld, checkIfAlreadyAdminNew, error_8, checkIfAlreadyAdmin, error_9;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!steamid['old']) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.getSteamid(steamid['old'])];
                                        case 1:
                                            oldSteamid = _a.sent();
                                            _a.label = 2;
                                        case 2:
                                            if (!steamid['new']) return [3 /*break*/, 4];
                                            return [4 /*yield*/, this.getSteamid(steamid['new'])];
                                        case 3:
                                            newSteamid = _a.sent();
                                            _a.label = 4;
                                        case 4:
                                            if (newSteamid && newSteamid['error'])
                                                return [2 /*return*/, { error: "new: ".concat(newSteamid.error) }];
                                            if (oldSteamid && oldSteamid['error'])
                                                return [2 /*return*/, { error: "old: ".concat(oldSteamid.error) }];
                                            if (!(oldSteamid && !newSteamid)) return [3 /*break*/, 10];
                                            return [4 /*yield*/, this.getAdmins(oldSteamid).catch(function (m) { return m; })];
                                        case 5:
                                            checkIfAdmin = _a.sent();
                                            if (!checkIfAdmin || checkIfAdmin['error'])
                                                return [2 /*return*/, { error: 'Admin não encontrado ou erro na requisição!' }];
                                            _a.label = 6;
                                        case 6:
                                            _a.trys.push([6, 8, , 9]);
                                            return [4 /*yield*/, new database_1.Database().query("DELETE FROM Cargos WHERE Id = ?", [checkIfAdmin[0].Id])];
                                        case 7:
                                            _a.sent();
                                            return [3 /*break*/, 9];
                                        case 8:
                                            error_7 = _a.sent();
                                            return [2 /*return*/, { error: 'Erro ao deletar o cargo' }];
                                        case 9: return [3 /*break*/, 24];
                                        case 10:
                                            if (!(oldSteamid && newSteamid)) return [3 /*break*/, 17];
                                            return [4 /*yield*/, this.getAdmins(oldSteamid).catch(function (m) { return m; })];
                                        case 11:
                                            checkIfAlreadyAdminOld = _a.sent();
                                            if (!checkIfAlreadyAdminOld || checkIfAlreadyAdminOld['error'])
                                                return [2 /*return*/, { error: 'Admin não encontrado ou erro na requisição!' }];
                                            return [4 /*yield*/, this.getAdmins(newSteamid).catch(function (m) { return m; })];
                                        case 12:
                                            checkIfAlreadyAdminNew = _a.sent();
                                            if ((checkIfAlreadyAdminNew && checkIfAlreadyAdminNew.length > 0) || (checkIfAlreadyAdminNew && checkIfAlreadyAdminNew['error'] && checkIfAlreadyAdminNew['error'] != 'Nenhum admin encontrado'))
                                                return [2 /*return*/, { error: 'Admin já cadastrado ou erro na requisição!' }];
                                            _a.label = 13;
                                        case 13:
                                            _a.trys.push([13, 15, , 16]);
                                            return [4 /*yield*/, new database_1.Database().query("UPDATE Cargos SET playerid = ? WHERE Id = ?", [newSteamid, checkIfAlreadyAdminOld[0].Id])];
                                        case 14:
                                            _a.sent();
                                            return [3 /*break*/, 16];
                                        case 15:
                                            error_8 = _a.sent();
                                            return [2 /*return*/, { error: 'Erro ao editar o cargo' }];
                                        case 16: return [3 /*break*/, 24];
                                        case 17:
                                            if (!(!oldSteamid && newSteamid)) return [3 /*break*/, 23];
                                            return [4 /*yield*/, this.getAdmins(newSteamid).catch(function (m) { return m; })];
                                        case 18:
                                            checkIfAlreadyAdmin = _a.sent();
                                            if ((checkIfAlreadyAdmin && checkIfAlreadyAdmin.length > 0) || (checkIfAlreadyAdmin && checkIfAlreadyAdmin['error'] && checkIfAlreadyAdmin['error'] != 'Nenhum admin encontrado'))
                                                return [2 /*return*/, { error: 'Admin já cadastrado ou erro na requisição!' }];
                                            _a.label = 19;
                                        case 19:
                                            _a.trys.push([19, 21, , 22]);
                                            return [4 /*yield*/, new database_1.Database().query("INSERT IGNORE INTO Cargos\n       (playerid, enddate, flags, server_id, discordID) \n      VALUES\n          (?, ?, 'a/z/t', ?, ?)", [newSteamid, (0, moment_1.default)(this.user.end_at, 'DD-MM-YYYY hh-mm-ss').local().add(3, 'hours').format('YYYY-MM-DD hh-mm-ss'), this.user.server_id, this.user.discord_id])];
                                        case 20:
                                            _a.sent();
                                            return [3 /*break*/, 22];
                                        case 21:
                                            error_9 = _a.sent();
                                            return [2 /*return*/, { error: 'Erro ao setar' }];
                                        case 22: return [3 /*break*/, 24];
                                        case 23: return [2 /*return*/, { error: 'Você preencheu a API de forma errada' }];
                                        case 24: return [2 /*return*/, true];
                                    }
                                });
                            }); }))];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, this.getAdmins(undefined, true)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Functions.prototype.setTk = function (bool) {
        return __awaiter(this, void 0, void 0, function () {
            var tk, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTk()];
                    case 1:
                        tk = _a.sent();
                        if (!tk || tk['error']) {
                            return [2 /*return*/, { error: tk['error'] ? tk.error : 'Erro ao buscar informações' }];
                        }
                        if (!(tk.tk == 1 && bool)) return [3 /*break*/, 2];
                        return [2 /*return*/, { error: 'O TK já estava ativado!' }];
                    case 2:
                        if (!(tk.tk == 0 && !bool)) return [3 /*break*/, 3];
                        return [2 /*return*/, { error: 'O TK já estava desativado!' }];
                    case 3:
                        data = tk.completeCFG.replace(tk.completeCFG.substring(tk.index, tk.completeCFG.indexOf('\n', tk.index)), "mp_friendlyfire ".concat(bool ? 1 : 0));
                        return [4 /*yield*/, axios_1.default.post("https://panel.mjsv.us/api/client/servers/".concat(this.user.identifier, "/files/write?file=%2Fcsgo%2Fcfg%2Fwarmod%2Fruleset_default.cfg"), data, {
                                headers: {
                                    'Content-Type': 'text/plain',
                                    'Accept': 'application/json',
                                    'Authorization': "Bearer ".concat(process.env.PANEL_API_KEY),
                                },
                            }).catch(function (err) {
                                return { error: 'Erro ao ativar o TK' };
                            })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.getTk(undefined, true)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, "TK ".concat(bool ? 'ativado' : 'desativado', " com sucesso!")];
                }
            });
        });
    };
    Functions.prototype.setPassword = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var passwordCfg, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (password.match(/[^a-zA-Z_:0-9]/g))
                            return [2 /*return*/, { error: 'Caracter especial detectado! A senha deve conter apenas letras ou números, não podendo ter [espaço, @,-,especiais da língua portuguesa como ç e ~,...]' }];
                        return [4 /*yield*/, this.getPassword()];
                    case 1:
                        passwordCfg = _a.sent();
                        if (!passwordCfg || passwordCfg['error']) {
                            return [2 /*return*/, { error: passwordCfg['error'] ? passwordCfg.error : 'Erro ao buscar informações' }];
                        }
                        data = passwordCfg.completeCFG.replace(passwordCfg.completeCFG.substring(passwordCfg.index, passwordCfg.completeCFG.indexOf('\n', passwordCfg.index)), "sv_password ".concat(password));
                        return [4 /*yield*/, axios_1.default.post("https://panel.mjsv.us/api/client/servers/".concat(this.user.identifier, "/files/write?file=%2Fcsgo%2Fcfg%2Fserver.cfg"), data, {
                                headers: {
                                    'Content-Type': 'text/plain',
                                    'Accept': 'application/json',
                                    'Authorization': "Bearer ".concat(process.env.PANEL_API_KEY),
                                },
                            }).catch(function (err) {
                                return { error: 'Erro ao mudar a senha' };
                            })];
                    case 2:
                        _a.sent();
                        new database_1.Database().query('UPDATE Servidor_Aluguel SET password = ? WHERE server_id = ?', [password, this.user.server_id]);
                        return [4 /*yield*/, this.getPassword(undefined, true)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, "Senha alterada para /".concat(password, "/ com sucesso!")];
                }
            });
        });
    };
    return Functions;
}());
exports.default = Functions;
