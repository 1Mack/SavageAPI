import { Router } from 'express';
import { Request, Response } from 'express';
import { ServersController } from '../controller/serversController';
const serversRouter = Router();

serversRouter.get('/', async (request: Request, response: Response) => {
  const servers = new ServersController(request).getServers()

  return response.json(servers)

});
serversRouter.get('/:name', async (request: Request, response: Response) => {
  const { name } = request.params
  const servers = new ServersController(request).findServer(name)

  return response.json(servers)

});

export default serversRouter;
