import express from "express";
import urlRoutes from "./routes/urlRoute.js";

const app = express();
app.use(express.json());
app.use("/", urlRoutes);

app.listen(3000, () => {
  console.log(" Server running at http://localhost:3000");
});
