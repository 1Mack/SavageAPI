import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors'
import routes from './routes'
import AppError from './errors/AppError';
import { QueryResult, query } from 'gamedig';
import { hostInfos } from './config/hostInfos';
interface IState extends QueryResult {
  raw?: any
}


const app = express()
app.use(cors())
app.use(express.json());
app.use(routes);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
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
  },
);

app.listen("22500", () => {
  console.log('Servidor rodando na porta http://localhost:22500')

  setInterval(async () => {
    let servers: any[] = []

    for (let serverPort of hostInfos) {

      await query({
        type: 'csgo',
        host: serverPort.host,
        port: serverPort.port,
      })
        .then((state: IState) => {
          let findSv = servers.find(sv => sv.name === serverPort.name)

          findSv ?
            findSv.serversInfos.push({
              name: state.name,
              map: state.map,
              ip: `${serverPort.host.startsWith('172') ? '131.196.196.196' : serverPort.host}:${serverPort.port}`,
              players: state.raw?.numplayers,
              playersTotal: state.maxplayers - 2
            })
            :
            servers.push({
              name: serverPort.name,
              redirectTo: '',
              serversInfos: [
                {
                  name: state.name,
                  map: state.map,
                  ip: `${serverPort.host.startsWith('172') ? '131.196.196.196' : serverPort.host}:${serverPort.port}`,
                  players: Number(state.raw.numplayers),
                  playersTotal: Number(state.maxplayers) - 2
                }
              ],
            })
        })
        .catch((err) => { })
    }
    servers = servers.map(sv => {
      if (sv.serversInfos.length <= 1) return sv;

      let newSv = []

      for (let i in sv.serversInfos) {
        if (sv.serversInfos[i].players > sv.serversInfos[i].playersTotal) {
          continue;
        } else {
          let playerDivision = Number((sv.serversInfos[i].players / sv.serversInfos[i].playersTotal).toFixed(2))

          if (playerDivision >= 1) {
            continue
          } else {
            newSv.push([playerDivision, i])
          }
        }

      }

      if (newSv.length == 0) {
        sv.redirectTo = ''
      } else {
        let getServers = newSv.reduce(function (prev: any, curr: any) {
          return (Math.abs(curr[0] - 0.45) < Math.abs(prev[0] - 0.4) ? curr : prev);
        })
        getServers = sv.serversInfos[getServers[1]].ip
        getServers ? sv.redirectTo = getServers : sv.redirectTo = sv.serversInfos[0].ip
      }
      return sv
    })
    return app.locals.servers = servers
  }, 15000);
})


