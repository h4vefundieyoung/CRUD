import { ServerResponse } from 'http';

import type { requestT } from '../middlewares';

export abstract class Controller {
  abstract handleRequest (req: requestT, res: ServerResponse): void
}