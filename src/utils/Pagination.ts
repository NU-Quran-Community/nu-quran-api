import { Request, Response, NextFunction } from "express";


const Pagination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let { page = "1", limit = "10", q = undefined } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);


    const result = {
        pagination: {
            "total_records": 100,
            "current_page": parseInt(page as string),
            "total_pages": 10,
            "next_page": 2,
            "prev_page": (page == '1') ? null : parseInt(page as string) - 1,
            "limit": parseInt(limit as string) || 10,
            offset,
        },
        resources: []
    }

    res.locals.result = result;
    next();
}

export default Pagination;