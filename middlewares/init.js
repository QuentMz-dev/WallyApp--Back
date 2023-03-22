import cors from "cors";
import express from "express";
import helmet from "helmet";

const initMiddlewares = (app) => {
  const corsOrigin = "*";
  const corsOptions = {
    origin: corsOrigin,
  };

  app.use(cors(corsOptions));
  app.use(helmet());

  app.use(express.json({ limit: "50mb" }));

  app.use(express.urlencoded({ extended: true }));
};

export default initMiddlewares;
