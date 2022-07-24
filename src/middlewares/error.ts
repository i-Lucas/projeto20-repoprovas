import { Request, Response, NextFunction } from 'express';

export default function errorHandle(err: any, req: Request, res: Response, next: NextFunction) {

    if (err.name === 'TokenExpiredError') return res.status(401).send('Token expired');
    if (err.name === 'JsonWebTokenError') return res.status(401).send('Invalid token');

    if (err.response) return res.sendStatus(err.response.status);
    if (err.status) return res.status(err.status).send(err.message); // throw errors manually

    res.sendStatus(500); // internal server error
};