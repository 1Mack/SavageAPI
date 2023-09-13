import { sign } from 'jsonwebtoken';
import AuthConfig from '../config/auth';
import moment from 'moment'
moment.locale('en-gb')
import AppError from '../errors/AppError';
import { Database } from '../database';
import axios from 'axios';
import { Request } from 'express';
interface IRequestBody {
  email: string;
  password: string;
}

interface IResponsePanelStore {
  name: string;
  ip: string;
  serverPassword: string;
  tempo: string;
  email: string;
  token: string;
  created_at: string;
  end_at: string;
}
interface IResponseWSToken {
  token: string
  socket: string
}

export default class SessionsController {
  public async panelStore({ email, password }: IRequestBody): Promise<IResponsePanelStore> {
    if (!email) throw new AppError(`Você deve preencher o campo email`);
    if (!password) throw new AppError(`Você deve preencher o campo password`)

    const databaseResult = await new Database().query(`SELECT * FROM Servidor_Aluguel WHERE email = ? AND panel_password = ?`, [email, password])

    if (databaseResult['error']) throw new AppError(databaseResult.error)
    if (databaseResult.length === 0) throw new AppError('Combinação de email/senha incorretos')


    if (databaseResult[0].token && databaseResult[0].token.length > 0) {
      let { name, ip, password: serverPassword, tempo, token, created_at, end_at } = databaseResult[0]
      return { name, ip, serverPassword, tempo, email, token, created_at, end_at }
    }

    const authconfig = AuthConfig((Number(moment(databaseResult[0].end_at, 'DD-MM-YYYY hh-mm-ss').diff(moment().local())) / 3600000) + 'h')

    const token = sign({ mode: 'panel' }, String(authconfig.secret), {
      subject: email,
      expiresIn: authconfig.expiresIn,
    });

    await new Database().query(`UPDATE Servidor_Aluguel set token = ? WHERE id = ?`, [token, databaseResult[0].id])

    let { name, ip, password: serverPassword, tempo, created_at, end_at } = databaseResult[0]

    return { name, ip, serverPassword, tempo, email, token, created_at, end_at }

  }
  public async WSToken(request: Request): Promise<IResponseWSToken> {


    try {
      const { data } = await axios.get(`https://panel.mjsv.us/api/client/servers/${request.user?.identifier}/websocket`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.PANEL_API_KEY}`,
        }
      })

      return { token: data.data.token, socket: data.data.socket }
    } catch (error) {
      throw new AppError('Erro ao gerar token')
    }
  }
}
