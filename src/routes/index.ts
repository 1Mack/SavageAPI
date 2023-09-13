import { Router } from 'express';

import aluguelRouter from './aluguel.routes';
import serversRouter from './servers.routes';
import utilidadesRouter from './utilidades.routes';

const routes = Router();

routes.use('/aluguel', aluguelRouter);
routes.use('/servers', serversRouter);
routes.use('/utilidades', utilidadesRouter);

export default routes;
