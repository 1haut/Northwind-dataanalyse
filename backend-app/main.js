import express from "express";
import bodyParser from "body-parser";
import routes from "./router/router.js"

const app = express();
const port = 8989;

app.use(bodyParser.json());
app.use(routes);

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
});
