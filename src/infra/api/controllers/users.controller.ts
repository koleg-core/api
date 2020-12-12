import { Request, Response } from "express";

export class UsersController {
  public index(req: Request, res: Response) {
    res.json({
      message: "Hello boi"
    });
  }
}

