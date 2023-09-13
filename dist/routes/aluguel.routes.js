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
var createAccountLimiter_1 = require("../middleawares/createAccountLimiter");
var sessionController_1 = __importDefault(require("../controller/sessionController"));
var express_1 = require("express");
var verifyToken_1 = __importDefault(require("../middleawares/verifyToken"));
var aluguelController_1 = require("../controller/aluguelController");
var crypto_1 = __importDefault(require("crypto"));
var oauth_1_0a_1 = __importDefault(require("oauth-1.0a"));
var axios_1 = __importDefault(require("axios"));
var AppError_1 = __importDefault(require("../errors/AppError"));
var aluguelRouter = (0, express_1.Router)();
aluguelRouter.post('/oauth', createAccountLimiter_1.CreateAccountLimiter, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = request.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, new sessionController_1.default().panelStore({ email: email, password: password })];
            case 1:
                result = _b.sent();
                return [2 /*return*/, response.json(result)];
        }
    });
}); });
aluguelRouter.get('/ws', [createAccountLimiter_1.CreateAccountLimiter, verifyToken_1.default], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, socket, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, new sessionController_1.default().WSToken(request)];
            case 1:
                _a = _b.sent(), socket = _a.socket, token = _a.token;
                return [2 /*return*/, response.json({ token: token, socket: socket })];
        }
    });
}); });
aluguelRouter.post('/command', [createAccountLimiter_1.CreateAccountLimiter, verifyToken_1.default], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var commands, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                commands = request.body;
                return [4 /*yield*/, new aluguelController_1.AluguelController(request).setCommands(commands)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, response.json({ message: result })];
        }
    });
}); });
aluguelRouter.post('/power', [createAccountLimiter_1.CreateAccountLimiter, verifyToken_1.default], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var power, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                power = request.body;
                return [4 /*yield*/, new aluguelController_1.AluguelController(request).setPower(power)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, response.json({ message: result })];
        }
    });
}); });
aluguelRouter.get('/match/infos', [createAccountLimiter_1.CreateAccountLimiter, verifyToken_1.default], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new aluguelController_1.AluguelController(request).getMatchInfos()];
            case 1:
                result = _a.sent();
                return [2 /*return*/, response.json({ timestamp: new Date().toLocaleString('en-GB'), data: result })];
        }
    });
}); });
aluguelRouter.delete('/match/infos', [createAccountLimiter_1.CreateAccountLimiter, verifyToken_1.default], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new aluguelController_1.AluguelController(request).deleteMatchInfos()];
            case 1:
                _a.sent();
                return [2 /*return*/, response.json({ timestamp: new Date().toLocaleString('en-GB'), message: 'Deletado com sucesso' })];
        }
    });
}); });
aluguelRouter.get('/demos', [createAccountLimiter_1.CreateAccountLimiter, verifyToken_1.default], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var query, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                query = request.query;
                return [4 /*yield*/, new aluguelController_1.AluguelController(request).getDemos(query)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, response.json({ timestamp: new Date().toLocaleString('en-GB'), data: result })];
        }
    });
}); });
aluguelRouter.put('/configurations', [/* CreateAccountLimiter,  */ verifyToken_1.default], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var body, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = request.body;
                return [4 /*yield*/, new aluguelController_1.AluguelController(request).setConfigurations(body)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, response.json({ timestamp: new Date().toLocaleString('en-GB'), data: result })];
        }
    });
}); });
aluguelRouter.get('/configurations', [createAccountLimiter_1.CreateAccountLimiter, verifyToken_1.default], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new aluguelController_1.AluguelController(request).getConfigurations()];
            case 1:
                result = _a.sent();
                return [2 /*return*/, response.json({ timestamp: new Date().toLocaleString('en-GB'), data: result })];
        }
    });
}); });
aluguelRouter.post('/biosolvit', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, targetState, targetAssignee, subProcessTargetState, comment, formFields, obj, findUndefinedValue, oauth, requestCfg, authorization, authHeader, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = request.body, targetState = _a.targetState, targetAssignee = _a.targetAssignee, subProcessTargetState = _a.subProcessTargetState, comment = _a.comment, formFields = _a.formFields;
                if (!formFields || !formFields['nome'] ||
                    !formFields['cpf'] ||
                    !formFields['identidade'] ||
                    !formFields['estadoCivil'] ||
                    !formFields['vinculo'] ||
                    !formFields['email'] ||
                    !formFields['telefone'] ||
                    !formFields['telefoneCelular'] ||
                    !formFields['fonteInformacao'] ||
                    !formFields['entidade'] ||
                    !formFields['tituloprojeto'] ||
                    !formFields['problema'] ||
                    !formFields['esboco'] ||
                    !formFields['mercado'] ||
                    !formFields['conhecimento'] ||
                    !formFields['diferenciais'] ||
                    !formFields['infoscomplementares'] ||
                    !formFields['comentarioInterno']) {
                    throw new AppError_1.default('Você deve preencher todos os campos');
                }
                obj = {
                    targetState: targetState,
                    targetAssignee: targetAssignee,
                    subProcessTargetState: subProcessTargetState,
                    comment: comment,
                    formFields: {
                        nome: formFields['nome'],
                        cpf: formFields['cpf'],
                        identidade: formFields['identidade'],
                        estadoCivil: formFields['estadoCivil'],
                        vinculo: formFields['vinculo'],
                        email: formFields['email'],
                        telefone: formFields['telefone'],
                        telefoneCelular: formFields['telefoneCelular'],
                        lattes: formFields['lattes'],
                        fonteInformacao: formFields['fonteInformacao'],
                        entidade: formFields['entidade'],
                        tituloprojeto: formFields['tituloprojeto'],
                        problema: formFields['problema'],
                        esboco: formFields['esboco'],
                        mercado: formFields['mercado'],
                        conhecimento: formFields['conhecimento'],
                        diferenciais: formFields['diferenciais'],
                        infoscomplementares: formFields['infoscomplementares'],
                        comentarioInterno: formFields['comentarioInterno']
                    },
                };
                findUndefinedValue = Object.keys(obj).flatMap(function (m) {
                    if (m == 'formFields') {
                        return Object.entries(obj[m]).map(function (m) { return m[1]; });
                    }
                    else {
                        return obj[m];
                    }
                }).find(function (m) { return m == undefined; });
                if (findUndefinedValue)
                    throw new AppError_1.default('Você deve preencher todos os campos!');
                oauth = new oauth_1_0a_1.default({
                    consumer: { key: '6ce71cee-2a2c-11ee-be56-0242ac120002', secret: '786f4f1e-2a2c-11ee-be56-0242ac120002-786f4f1e-2a2c-11ee-be56-0242ac120002' },
                    signature_method: 'HMAC-SHA1',
                    hash_function: function (base_string, key) {
                        return crypto_1.default
                            .createHmac('sha1', key)
                            .update(base_string)
                            .digest('base64');
                    },
                });
                requestCfg = {
                    url: 'https://biosolvitsolucoes144898.fluig.cloudtotvs.com.br/process-management/api/v2/processes/Processo_1/start',
                    method: 'POST',
                    body: JSON.stringify(obj)
                };
                authorization = oauth.authorize(requestCfg, {
                    key: '5b2cd526-2f9c-4205-aa48-f71b59facee2',
                    secret: '783846da-5f7f-4c15-b5ef-bec75a29b0c1bb3081f1-456a-4eb4-987b-903bb16d4128',
                });
                authHeader = oauth.toHeader(authorization);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post(requestCfg.url, requestCfg.body, {
                        headers: { "Authorization": authHeader.Authorization, "Content-Type": "application/json" }
                    })];
            case 2:
                _b.sent();
                return [2 /*return*/, response.json({ message: 'Enviado com sucesso!' })];
            case 3:
                error_1 = _b.sent();
                throw new AppError_1.default('Erro ao enviar os dados');
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = aluguelRouter;
