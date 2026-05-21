import app from "./app";
const port = 7000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const main = () => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

main();
