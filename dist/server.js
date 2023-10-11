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
var express_1 = __importDefault(require("express"));
require("express-async-errors");
var cors_1 = __importDefault(require("cors"));
var routes_1 = __importDefault(require("./routes"));
var AppError_1 = __importDefault(require("./errors/AppError"));
var gamedig_1 = require("gamedig");
var hostInfos_1 = require("./config/hostInfos");
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(routes_1.default);
app.use(function (err, request, response, next) {
    if (err instanceof AppError_1.default) {
        return response.status(err.statusCode).json({
            status: 'error',
            error: err.message,
        });
    }
    console.log(err);
    return response.status(500).json({
        status: 'error',
        error: 'Internal server error',
    });
});
app.listen("22500", function () {
    console.log('Servidor rodando na porta http://localhost:22500');
    setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
        var servers, _loop_1, _i, hostInfos_2, hostInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    servers = [];
                    _loop_1 = function (hostInfo) {
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, (0, gamedig_1.query)({
                                        type: 'csgo',
                                        host: hostInfo.host,
                                        port: hostInfo.port,
                                    })
                                        .then(function (state) {
                                        var _a;
                                        var findSv = servers.find(function (sv) { return sv.name === hostInfo.name; });
                                        findSv ?
                                            findSv.serversInfos.push({
                                                name: state.name,
                                                map: state.map,
                                                ip: "".concat(hostInfo.host.startsWith('172') ? '131.196.196.196' : hostInfo.host, ":").concat(hostInfo.port),
                                                players: (_a = state.raw) === null || _a === void 0 ? void 0 : _a.numplayers,
                                                playersTotal: state.maxplayers - 2,
                                                type: hostInfo.type
                                            })
                                            :
                                                servers.push({
                                                    name: hostInfo.name,
                                                    redirectTo: '',
                                                    serversInfos: [
                                                        {
                                                            name: state.name,
                                                            map: state.map,
                                                            ip: "".concat(hostInfo.host.startsWith('172') ? '131.196.196.196' : hostInfo.host, ":").concat(hostInfo.port),
                                                            players: Number(state.raw.numplayers),
                                                            playersTotal: Number(state.maxplayers) - 2,
                                                            type: hostInfo.type
                                                        }
                                                    ],
                                                });
                                    })
                                        .catch(function (err) { })];
                                case 1:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, hostInfos_2 = hostInfos_1.hostInfos;
                    _a.label = 1;
                case 1:
                    if (!(_i < hostInfos_2.length)) return [3 /*break*/, 4];
                    hostInfo = hostInfos_2[_i];
                    return [5 /*yield**/, _loop_1(hostInfo)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    servers = servers.map(function (sv) {
                        if (sv.serversInfos.length <= 1)
                            return sv;
                        var newSv = [];
                        for (var i in sv.serversInfos) {
                            if (sv.serversInfos[i].players > sv.serversInfos[i].playersTotal) {
                                continue;
                            }
                            else {
                                var playerDivision = Number((sv.serversInfos[i].players / sv.serversInfos[i].playersTotal).toFixed(2));
                                if (playerDivision >= 1) {
                                    continue;
                                }
                                else {
                                    newSv.push([playerDivision, i]);
                                }
                            }
                        }
                        if (newSv.length == 0) {
                            sv.redirectTo = '';
                        }
                        else {
                            var getServers = newSv.reduce(function (prev, curr) {
                                return (Math.abs(curr[0] - 0.45) < Math.abs(prev[0] - 0.4) ? curr : prev);
                            });
                            getServers = sv.serversInfos[getServers[1]].ip;
                            getServers ? sv.redirectTo = getServers : sv.redirectTo = sv.serversInfos[0].ip;
                        }
                        return sv;
                    });
                    return [2 /*return*/, app.locals.servers = servers];
            }
        });
    }); }, 15000);
});
