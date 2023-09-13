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
exports.UtilidadesController = void 0;
var AppError_1 = __importDefault(require("../errors/AppError"));
var steamid_1 = __importDefault(require("steamid"));
var axios_1 = __importDefault(require("axios"));
var UtilidadesController = /** @class */ (function () {
    function UtilidadesController(request) {
        this.request = request;
    }
    UtilidadesController.prototype.getSteamid = function (steamURL) {
        return __awaiter(this, void 0, void 0, function () {
            function getSteamid64() {
                return __awaiter(this, void 0, void 0, function () {
                    var error_4;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, axios_1.default.get("https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=".concat(process.env.STEAMID_API_KEY, "&vanityurl=").concat(steamURL)).then(function (_a) {
                                        var data = _a.data;
                                        return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_b) {
                                                if (data.response['message'])
                                                    throw Error('erro');
                                                return [2 /*return*/, data.response.steamid];
                                            });
                                        });
                                    })];
                            case 1: return [2 /*return*/, _a.sent()];
                            case 2:
                                error_4 = _a.sent();
                                throw new AppError_1.default('Erro no link');
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
            var steamid64, error_1, error_2, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!steamURL)
                            throw new AppError_1.default('Você deve fornecer o parametro /steamURL/');
                        if (steamURL.includes('STEAM_'))
                            return [2 /*return*/, steamURL];
                        if (!((steamURL.includes('steamcommunity.com/id/') || steamURL.includes('steamcommunity.com/profiles/')) &&
                            (steamURL.includes('http') || steamURL.includes('https')))) {
                            if (!isNaN(Number(steamURL)) && Number(steamURL) > 10) {
                                try {
                                    return [2 /*return*/, new steamid_1.default(steamURL).getSteam2RenderedID(true)];
                                }
                                catch (error) {
                                    throw new AppError_1.default('Erro no Link');
                                }
                            }
                            else {
                                throw new AppError_1.default('Você digitou o link do seu perfil Errado');
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
                        error_1 = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, getSteamid64()];
                    case 4:
                        steamid64 = _a.sent();
                        return [2 /*return*/, new steamid_1.default(steamid64).getSteam2RenderedID(true).toString()];
                    case 5:
                        error_2 = _a.sent();
                        throw new AppError_1.default('Erro no link');
                    case 6: return [3 /*break*/, 7];
                    case 7:
                        _a.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, getSteamid64()];
                    case 8:
                        steamid64 = _a.sent();
                        return [2 /*return*/, new steamid_1.default(steamid64).getSteam2RenderedID(true).toString()];
                    case 9:
                        error_3 = _a.sent();
                        throw new AppError_1.default('Erro no link');
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return UtilidadesController;
}());
exports.UtilidadesController = UtilidadesController;
