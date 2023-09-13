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
var jsonwebtoken_1 = require("jsonwebtoken");
var auth_1 = __importDefault(require("../config/auth"));
var moment_1 = __importDefault(require("moment"));
moment_1.default.locale('en-gb');
var AppError_1 = __importDefault(require("../errors/AppError"));
var database_1 = require("../database");
var axios_1 = __importDefault(require("axios"));
var SessionsController = /** @class */ (function () {
    function SessionsController() {
    }
    SessionsController.prototype.panelStore = function (_a) {
        var email = _a.email, password = _a.password;
        return __awaiter(this, void 0, void 0, function () {
            var databaseResult, _b, name_1, ip_1, serverPassword_1, tempo_1, token_1, created_at_1, end_at_1, authconfig, token, _c, name, ip, serverPassword, tempo, created_at, end_at;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!email)
                            throw new AppError_1.default("Voc\u00EA deve preencher o campo email");
                        if (!password)
                            throw new AppError_1.default("Voc\u00EA deve preencher o campo password");
                        return [4 /*yield*/, new database_1.Database().query("SELECT * FROM Servidor_Aluguel WHERE email = ? AND panel_password = ?", [email, password])];
                    case 1:
                        databaseResult = _d.sent();
                        if (databaseResult['error'])
                            throw new AppError_1.default(databaseResult.error);
                        if (databaseResult.length === 0)
                            throw new AppError_1.default('Combinação de email/senha incorretos');
                        if (databaseResult[0].token && databaseResult[0].token.length > 0) {
                            _b = databaseResult[0], name_1 = _b.name, ip_1 = _b.ip, serverPassword_1 = _b.password, tempo_1 = _b.tempo, token_1 = _b.token, created_at_1 = _b.created_at, end_at_1 = _b.end_at;
                            return [2 /*return*/, { name: name_1, ip: ip_1, serverPassword: serverPassword_1, tempo: tempo_1, email: email, token: token_1, created_at: created_at_1, end_at: end_at_1 }];
                        }
                        authconfig = (0, auth_1.default)((Number((0, moment_1.default)(databaseResult[0].end_at, 'DD-MM-YYYY hh-mm-ss').diff((0, moment_1.default)().local())) / 3600000) + 'h');
                        token = (0, jsonwebtoken_1.sign)({ mode: 'panel' }, String(authconfig.secret), {
                            subject: email,
                            expiresIn: authconfig.expiresIn,
                        });
                        return [4 /*yield*/, new database_1.Database().query("UPDATE Servidor_Aluguel set token = ? WHERE id = ?", [token, databaseResult[0].id])];
                    case 2:
                        _d.sent();
                        _c = databaseResult[0], name = _c.name, ip = _c.ip, serverPassword = _c.password, tempo = _c.tempo, created_at = _c.created_at, end_at = _c.end_at;
                        return [2 /*return*/, { name: name, ip: ip, serverPassword: serverPassword, tempo: tempo, email: email, token: token, created_at: created_at, end_at: end_at }];
                }
            });
        });
    };
    SessionsController.prototype.WSToken = function (request) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("https://panel.mjsv.us/api/client/servers/".concat((_a = request.user) === null || _a === void 0 ? void 0 : _a.identifier, "/websocket"), {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                    'Authorization': "Bearer ".concat(process.env.PANEL_API_KEY),
                                }
                            })];
                    case 1:
                        data = (_b.sent()).data;
                        return [2 /*return*/, { token: data.data.token, socket: data.data.socket }];
                    case 2:
                        error_1 = _b.sent();
                        throw new AppError_1.default('Erro ao gerar token');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SessionsController;
}());
exports.default = SessionsController;
