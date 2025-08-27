import { User } from '../../models';

declare global {
  namespace Express {
    interface Request {
      id?: number;
      user?: User;
    }
  }
}
