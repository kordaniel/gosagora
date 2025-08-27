import { User } from '../../models';

declare global {
  namespace Express {
    interface Request {
      parsedIds?: Record<string, number>;
      user?: User;
    }
  }
}
