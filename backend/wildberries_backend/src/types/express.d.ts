import { Users } from "../entities/user";

declare global {
  namespace Express {
    interface Request {
      user?: Users; // <-- tell TS that req.user exists
    }
  }
}
