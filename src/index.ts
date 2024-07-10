import express from "express";
import UserRouter from "./router/User"
import ExpressError from "./utils/ExpressError";
import ConfiguredSession from "./config/ConfiguredSession";


declare module 'express-session' {
    interface SessionData {
        user: {
            email: string;
            id: string;
            pk: number;
        };
    }
}

const app = express();
app.use(express.json())
app.use(ConfiguredSession);


app.use("/users", UserRouter);


app.get("*", (req: express.Request, res: express.Response) => {
    res.status(404).send({msg: "404, endpoint not found"});
})

app.use((err: express.ErrorRequestHandler, req: express.Request, res: express.Response, next: express.NextFunction): void => {
    if (err instanceof ExpressError) {
        const {message="Internal server error", status=500} = err;
        res.status(404).send({ message, status });
    }
    else res.send(err)
})


export default app;