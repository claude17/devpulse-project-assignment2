import app from "./app";
import { initDB } from "./db";
const port = 7000;

initDB();
const main = () => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

main();
