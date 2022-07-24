import { NextFunction, Request, Response } from 'express';

export default function validateSchema(schema: any) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (schema.validate(req.body).error)
        return res.status(422).send(schema.validate(req.body).error.details[0].message);
        next();
    }
};