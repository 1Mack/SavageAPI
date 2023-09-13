import { Router } from 'express';
import { Request, Response } from 'express';
import { UtilidadesController } from '../controller/utilidadesController';
const utilidadesRouter = Router();

utilidadesRouter.post('/steamid', async (request: Request, response: Response) => {

  const { steamURL } = request.body

  const result = await new UtilidadesController(request).getSteamid(steamURL)

  return response.json(result)

});


export default utilidadesRouter;
