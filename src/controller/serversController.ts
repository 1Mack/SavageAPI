import { Request } from "express"
import AppError from "../errors/AppError"

export class ServersController {
  private request
  constructor(request: Request) {
    this.request = request
  }
  public getServers() {
    const servers = this.request.app.locals.servers
    if (!servers) throw new AppError('Servidores ainda não foram carregados')
    const newServers = JSON.parse(JSON.stringify(this.request.app.locals.servers))
    newServers.map((svs: any) => {
      svs.serversInfos = svs.serversInfos.map((sv: any) => {
        if (sv.ip.includes('131.196.196.196')) {
          sv.ip = sv.ip.replace('131.196.196.196', 'ip2.savageservidores.com')
          return sv
        } else {
          sv.ip = sv.ip.replace('131.196.196.197', 'ip.savageservidores.com')
          return sv
        }
      })
    })
    return newServers
  }
  public findServer(name: string) {
    if (!name) throw new AppError('Você deve fornecer o /name/')

    const servers = this.request.app.locals.servers

    if (!servers) throw new AppError('Servidores ainda não foram carregados')

    let server = servers.find((sv: any) => sv.name === name)

    if (!server) throw new AppError('Servidor não encontrado')

    if (server.redirectTo !== '') return { redirectTo: server.redirectTo }

    const serversGet = []

    for (let i in servers) {
      if (servers[i].name === name) continue;

      if (servers[i].redirectTo === '') {
        if (servers[i].serversInfos[0].players < (servers[i].serversInfos[0].playersTotal - 1)) {
          serversGet.push(servers[i].serversInfos[0])
        }
      } else {
        serversGet.push(servers[i].serversInfos.find((sv: any) => sv.ip === servers[i].redirectTo))
      }
    }

    return {
      redirectTo: '',
      servers: serversGet.map((sv: any) => `${sv.name.slice(0, sv.name.indexOf('|')).trimEnd()}&${sv.ip}`).join('|'), serverCount: serversGet.length
    }

  }
}


