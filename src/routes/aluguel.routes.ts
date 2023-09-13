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
aluguelRouter.post('/password', [CreateAccountLimiter, VerifyToken], async (request: Request, response: Response) => {

  const body = request.body

  const result = await new AluguelController(request).setPassword(body)


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

aluguelRouter.post('/biosolvit', async (request: Request, response: Response) => {

  const {
    targetState,
    targetAssignee,
    subProcessTargetState,
    comment,
    formFields
  } = request.body


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
    !formFields['comentarioInterno']
  ) {
    throw new AppError('Você deve preencher todos os campos')
  }

  const obj = {
    targetState,
    targetAssignee,
    subProcessTargetState,
    comment,
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
  }

  const findUndefinedValue = Object.keys(obj).flatMap((m) => {
    if (m == 'formFields') {

      return Object.entries(obj[m]).map(m => m[1])
    } else { return obj[m as keyof typeof obj] }
  }).find(m => m == undefined)

  if (findUndefinedValue) throw new AppError('Você deve preencher todos os campos!')


  const oauth = new OAuth({
    consumer: { key: '6ce71cee-2a2c-11ee-be56-0242ac120002', secret: '786f4f1e-2a2c-11ee-be56-0242ac120002-786f4f1e-2a2c-11ee-be56-0242ac120002' },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto
        .createHmac('sha1', key)
        .update(base_string)
        .digest('base64')
    },
  })
  const requestCfg = {
    url: 'https://biosolvitsolucoes144898.fluig.cloudtotvs.com.br/process-management/api/v2/processes/Processo_1/start',
    method: 'POST',
    body: JSON.stringify(obj)
  };
  const authorization = oauth.authorize(requestCfg, {
    key: '5b2cd526-2f9c-4205-aa48-f71b59facee2',
    secret: '783846da-5f7f-4c15-b5ef-bec75a29b0c1bb3081f1-456a-4eb4-987b-903bb16d4128',
  });

  const authHeader = oauth.toHeader(authorization)

  try {
    await axios.post(requestCfg.url, requestCfg.body, {
      headers: { "Authorization": authHeader.Authorization, "Content-Type": "application/json" }
    })
    return response.json({ message: 'Enviado com sucesso!' })
  } catch (error) {
    throw new AppError('Erro ao enviar os dados')
  }

})


export default aluguelRouter;
