import { Router } from "express";
import { LessonsController } from "../controllers/lessons.controller.js";
import { jwtMiddleware } from "../middlewares/jwt.middleware.js";

const initLessonsRoutes = (app, sm) => {
  const router = Router();

  //JwtMiddleware en argument check si token est present
  // Et donc interdire l'acces a /read si non connecté
  //=
  // router.get("/read", jwtMiddleware, LessonsController.read);
  //=
  router.get("/read", sm, LessonsController.read);
  router.get("/read-admin", jwtMiddleware, sm, LessonsController.readAdmin);
  // router.post("/post-one",jwtMiddleware, sm, LessonsController.postOne);
  router.post("/post-one", jwtMiddleware, sm, LessonsController.postOne);
  router.post("/delete-one", jwtMiddleware, sm, LessonsController.deleteOne);
  // router.post(
  //   "/update-member",
  //   jwtMiddleware,
  //   sm,
  //   LessonsController.updateAddMemberInSlots
  // );
  router.post(
    "/update-member",
    jwtMiddleware,
    sm,
    LessonsController.updateAddMemberInSlots
  );
  router.post(
    "/update-remove-one",
    jwtMiddleware,
    sm,
    LessonsController.updateRemoveOneInSlots
  );
  // router.get("/getOne/:id", LessonsController.getOne);

  app.use("/lessons", router);
};

export default initLessonsRoutes;
