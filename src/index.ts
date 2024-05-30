import express from "express";
import get_config from "./config/config";


const app = express();
const port = get_config("PORT") || 3030



app.get("*", (req: express.Request, res: express.Response) => {
    res.status(404).send({msg: "404, endpoint not found"});
})


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})