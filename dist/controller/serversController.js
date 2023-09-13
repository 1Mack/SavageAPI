"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServersController = void 0;
var AppError_1 = __importDefault(require("../errors/AppError"));
var ServersController = /** @class */ (function () {
    function ServersController(request) {
        this.request = request;
    }
    ServersController.prototype.getServers = function () {
        var servers = this.request.app.locals.servers;
        if (!servers)
            throw new AppError_1.default('Servidores ainda não foram carregados');
        var newServers = JSON.parse(JSON.stringify(this.request.app.locals.servers));
        newServers.map(function (svs) {
            svs.serversInfos = svs.serversInfos.map(function (sv) {
                if (sv.ip.includes('131.196.196.196')) {
                    sv.ip = sv.ip.replace('131.196.196.196', 'ip2.savageservidores.com');
                    return sv;
                }
                else {
                    sv.ip = sv.ip.replace('131.196.196.197', 'ip.savageservidores.com');
                    return sv;
                }
            });
        });
        return newServers;
    };
    ServersController.prototype.findServer = function (name) {
        if (!name)
            throw new AppError_1.default('Você deve fornecer o /name/');
        var servers = this.request.app.locals.servers;
        if (!servers)
            throw new AppError_1.default('Servidores ainda não foram carregados');
        var server = servers.find(function (sv) { return sv.name === name; });
        if (!server)
            throw new AppError_1.default('Servidor não encontrado');
        if (server.redirectTo !== '')
            return { redirectTo: server.redirectTo };
        var serversGet = [];
        var _loop_1 = function (i) {
            if (servers[i].name === name)
                return "continue";
            if (servers[i].redirectTo === '') {
                if (servers[i].serversInfos[0].players < (servers[i].serversInfos[0].playersTotal - 1)) {
                    serversGet.push(servers[i].serversInfos[0]);
                }
            }
            else {
                serversGet.push(servers[i].serversInfos.find(function (sv) { return sv.ip === servers[i].redirectTo; }));
            }
        };
        for (var i in servers) {
            _loop_1(i);
        }
        return {
            redirectTo: '',
            servers: serversGet.map(function (sv) { return "".concat(sv.name.slice(0, sv.name.indexOf('|')).trimEnd(), "&").concat(sv.ip); }).join('|'), serverCount: serversGet.length
        };
    };
    return ServersController;
}());
exports.ServersController = ServersController;
