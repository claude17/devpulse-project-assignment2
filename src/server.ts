import app from "./app";
import { initDB } from "./db";
const port = 7000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

initDB();
const main = () => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

main();
