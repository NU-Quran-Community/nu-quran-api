import express from "express";
import UserRouter from "./router/User"
import WeeklyPointsRouter from "./router/WeeklyPoints"
import MonthlyPointsRouter from "./router/MonthlyPoints"
import ExpressError from "./utils/ExpressError";
import ConfiguredSession from "./config/ConfiguredSession";
import cors from "cors"

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
app.use(cors({
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'], // Your frontend origin
    credentials: true, // Allow credentials (cookies, authorization headers, TLS client certificates)
}))
app.use(ConfiguredSession);


app.use("/monthly-points", MonthlyPointsRouter);
app.use("/weekly-points", WeeklyPointsRouter);
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