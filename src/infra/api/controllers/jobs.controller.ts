import { Request, Response } from "express";

export class JobsController {

  public index(req: Request, res: Response): void {
    res.json({
      message: "Hello boi"
    });
  }
}