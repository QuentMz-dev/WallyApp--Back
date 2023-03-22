import { Router } from "express";
import { UsersController } from "../controllers/users.controller.js";
import { jwtMiddleware } from "../middlewares/jwt.middleware.js";

const initUsersRoutes = (app, sm) => {
  const router = Router();
  router.get("/read", sm, UsersController.read);
  router.post("/sign-up", sm, UsersController.signUp);
  router.post("/sign-in", sm, UsersController.signIn);
  router.get("/check-role", jwtMiddleware, sm, UsersController.checkRole);
  router.post("/set-admin", jwtMiddleware, sm, UsersController.setAdmin);
  router.post("/delete-admin", jwtMiddleware, sm, UsersController.deleteAdmin);

  app.use("/users", router);
};

export default initUsersRoutes;
