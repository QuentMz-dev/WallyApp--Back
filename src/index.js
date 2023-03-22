import express from "express";
import initRoutes from "./routes/router.js";
import initMiddlewares from "./middlewares/init.js";
import initDb from "./config/database.config.js";

const app = express();
const PORT = process.env.PORT || 5001;
// const PORT = process.env.PORT ? process.env.PORT : 7001;

// TEST SI SERVEUR TOURNE
app.get("/", (req, res) => {
  res.send("test");
});

await initDb();
initMiddlewares(app);
initRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
