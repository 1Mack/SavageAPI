import { Request, Response, NextFunction } from 'express';

import AppError from '../errors/AppError';
import { Database } from '../database';
import cache from 'memory-cache'
import moment from 'moment';
moment.locale('en-gb')
export default async function VerifyToken(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers['authorization'];

  if (!authHeader) throw new AppError('Token JWT está faltando', 401);


  const token = authHeader.split(' ')[1]


  if (token == 'undefined') throw new AppError('Token JWT está faltando', 401);

  let findCache = cache.get(token)

  if (!findCache) {
    let result
    try {
      [result] = await new Database().query('SELECT * from Servidor_Aluguel WHERE token = ?', [token])
    } catch (err) {
      throw new AppError(err instanceof AppError ? err.message : 'Erro ao buscar token', 401);
    }
    if (!result) throw new Error('Token é invalido')

    let time = Number(moment(result.end_at, 'DD-MM-YYYY hh-mm-ss').diff(moment().local()))

    cache.put(token, result, time > 3600000 ? 3600000 : time)

    request.user = result

    return next();
  }

  request.user = findCache

  return next();


}
