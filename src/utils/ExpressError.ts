export default class ExpressError extends Error{
    message: string;
    status: number;
    id: string;

    constructor(msg: string, status: number, id = "test"){
        super();
        this.message = msg;
        this.status = status;
        this.id = id;
    }
}