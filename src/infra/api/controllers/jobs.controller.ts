import { Request, Response } from "express";

export class JobsController {
  public index(req: Request, res: Response) {
    res.json({
      message: "Hello boi"
    });
  }
}