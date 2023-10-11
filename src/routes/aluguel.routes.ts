import { CreateAccountLimiter } from '../middleawares/createAccountLimiter';
import SessionsController from '../controller/sessionController';
import { Router } from 'express';
import VerifyToken from '../middleawares/verifyToken';
import { Request, Response } from 'express';
import { AluguelController } from '../controller/aluguelController';
import crypto from 'crypto'
import OAuth from 'oauth-1.0a'
import axios from 'axios'
import AppError from '../errors/AppError';
const aluguelRouter = Router();


aluguelRouter.post('/oauth', CreateAccountLimiter, async (request: Request, response: Response) => {
  const { email, password } = request.body;

  const result = await new SessionsController().panelStore({ email, password })

  return response.json(result)

});
aluguelRouter.get('/ws', [CreateAccountLimiter, VerifyToken], async (request: Request, response: Response) => {

  const { socket, token } = await new SessionsController().WSToken(request)

  return response.json({ token, socket })
});
aluguelRouter.post('/command', [CreateAccountLimiter, VerifyToken], async (request: Request, response: Response) => {

  const commands = request.body

  const result = await new AluguelController(request).setCommands(commands)


  return response.json({ message: result })
})
aluguelRouter.post('/power', [CreateAccountLimiter, VerifyToken], async (request: Request, response: Response) => {

  const power = request.body

  const result = await new AluguelController(request).setPower(power)

  return response.json({ message: result })
})
aluguelRouter.get('/match/infos', [CreateAccountLimiter, VerifyToken], async (request: Request, response: Response) => {

  const result = await new AluguelController(request).getMatchInfos()

  return response.json({ timestamp: new Date().toLocaleString('en-GB'), data: result })
})
aluguelRouter.delete('/match/infos', [CreateAccountLimiter, VerifyToken], async (request: Request, response: Response) => {

  await new AluguelController(request).deleteMatchInfos()

  return response.json({ timestamp: new Date().toLocaleString('en-GB'), message: 'Deletado com sucesso' })
})
aluguelRouter.get('/demos', [CreateAccountLimiter, VerifyToken], async (request: Request, response: Response) => {

  const { query } = request

  const result = await new AluguelController(request).getDemos(query)

  return response.json({ timestamp: new Date().toLocaleString('en-GB'), data: result })
})

aluguelRouter.put('/configurations', [/* CreateAccountLimiter,  */VerifyToken], async (request: Request, response: Response) => {

  const { body } = request

  const result = await new AluguelController(request).setConfigurations(body)

  return response.json({ timestamp: new Date().toLocaleString('en-GB'), data: result })
})
aluguelRouter.get('/configurations', [CreateAccountLimiter, VerifyToken], async (request: Request, response: Response) => {

  const result = await new AluguelController(request).getConfigurations()

  return response.json({ timestamp: new Date().toLocaleString('en-GB'), data: result })
})

export default aluguelRouter;
