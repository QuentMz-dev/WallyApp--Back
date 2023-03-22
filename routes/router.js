import { sanitizerMiddleware } from "../middlewares/sanitizer.middleware.js";
import initLessonsRoutes from "./lessons.routes.js";
import initUsersRoutes from "./users.routes.js";

const initRoutes = (app) => {
  initUsersRoutes(app, sanitizerMiddleware);
  initLessonsRoutes(app, sanitizerMiddleware);
};

export default initRoutes;
