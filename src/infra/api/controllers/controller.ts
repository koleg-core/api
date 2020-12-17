import { Request, Response } from "express";
import { Json } from "sequelize/types/lib/utils";

export abstract class Controller {

    protected validRequestParams(req: Request, res: Response): void {
        if (!req) {
            throw new Error('Invalid argument req: Request is udefined');
        }
        if (!res) {
            throw new Error('Invalid argument res: Response is udefined');
        }
    }
}